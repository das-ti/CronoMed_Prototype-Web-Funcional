"use strict";
/* CronoMed: estado e regras de negócio (front-end simulado). RF/RNF = requisitos da documentação. */
const PRICE = 399,
  SHIP = {
    padrao: ["Padrão", "5 a 8 dias úteis", 24.9],
    expresso: ["Expresso", "2 a 4 dias úteis", 49.9],
  };
const MODS = [
  ["doses", "Próximas doses"],
  ["estoque", "Estoque"],
  ["historico", "Histórico"],
  ["medicamentos", "Gerenciar Medicamentos"],
  ["compartilhamento", "Compartilhamento"],
  ["dispositivos", "Dispositivos"],
  ["configuracoes", "Configurações"],
];
const CORES = [
  ["Vermelho", "#DD4245", "Listras diagonais"],
  ["Verde", "#56AF62", "Pontos"],
  ["Amarelo", "#F6D331", "Listras horizontais"],
  ["Roxo", "#9E5CA8", "Xadrez"],
  ["Azul", "#5B9BD5", "Listras verticais"],
  ["Laranja", "#EE8843", "Zigue-zague"],
];
const TIPOS = {
  familiar: "Familiar",
  cuidador: "Cuidador",
  enfermeiro: "Enfermeiro (COREN)",
  medico: "Médico (CRM)",
};
const PSTEPS = [
  "Pedido recebido",
  "Pagamento confirmado",
  "Em separação",
  "Enviado",
  "Entregue",
];
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : "id" + Math.random().toString(16).slice(2) + Date.now();
const brl = (n) => "R$ " + Number(n).toFixed(2).replace(".", ",");
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const KEY = "cronomed.v2";
let S,
  U = {
    pay: 1,
    bt: 1,
    hf: "30",
    simOpen: false,
    menu: false,
    note: null,
    led: null,
    sel: null,
  };
const fresh = () => ({
  users: [],
  session: null,
  cart: null,
  ck: {},
  orders: [],
  box: null,
  meds: {},
  log: {},
  history: [],
  shares: [],
  emails: [],
  queue: [],
  audit: [],
  online: true,
  sim: { bt: true, near: true, off: 0 },
  cfg: { font: 0, contrast: false, narrate: false, voice: true, days: 5 },
  bio: false,
  tokens: {},
});
function load() {
  try {
    S = JSON.parse(localStorage.getItem(KEY)) || fresh();
  } catch (e) {
    S = fresh();
  }
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
}
/* tempo (relógio simulável) */
const nowMs = () => Date.now() + S.sim.off * 60000,
  now = () => new Date(nowMs());
const hm = (d) => d.toTimeString().slice(0, 5),
  dk = (d) => d.toLocaleDateString("sv-SE"),
  toMin = (t) => +t.slice(0, 2) * 60 + +t.slice(3, 5);
/* usuários, sessão e permissões por módulo (RF40, RF41) */
const me = () => S.users.find((u) => u.id === S.session),
  titular = () => S.users.find((u) => u.role === "titular"),
  isT = () => {
    const u = me();
    return !!u && u.role === "titular";
  };
const shareOf = (u) =>
  u && S.shares.find((s) => s.userId === u.id && s.status === "ativo");
function can(mod, lvl = "V") {
  const u = me();
  if (!u) return false;
  if (u.role === "titular") return true;
  const sh = shareOf(u);
  if (!sh) return false;
  const p = sh.perms[mod];
  return lvl === "V" ? !!p : p === "G";
}
const cpfOk = (v) => {
  v = String(v).replace(/\D/g, "");
  if (v.length !== 11 || /^(\d)\1+$/.test(v)) return false;
  for (let t = 9; t < 11; t++) {
    let s = 0;
    for (let i = 0; i < t; i++) s += +v[i] * (t + 1 - i);
    if (((s * 10) % 11) % 10 !== +v[t]) return false;
  }
  return true;
};
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const pwChecks = (p) => [
  p.length >= 8,
  /[A-Z]/.test(p),
  /[a-z]/.test(p),
  /\d/.test(p),
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
];
const pwOk = (p) => pwChecks(p).every(Boolean);
const audit = (t) => {
  S.audit.unshift({ ts: Date.now(), by: (me() || {}).nome || "Sistema", t });
  S.audit = S.audit.slice(0, 40);
};
/* e-mails simulados (ativação, redefinição, convite, pedido) */
function mail(tipo, to, data = {}) {
  const m = { id: uid(), ts: Date.now(), tipo, to, data, read: false };
  S.emails.unshift(m);
  save();
  if (typeof toast === "function") toast("Novo e-mail na caixa simulada");
  return m;
}
/* medicamentos e doses (RF05 a RF13) */
const created = (m) => m.created || 0;
function dosesToday() {
  const d = now(),
    dow = d.getDay(),
    day = dk(d),
    out = [];
  for (const [slot, m] of Object.entries(S.meds)) {
    (m.times || []).forEach((t) => {
      if (!(m.days || []).includes(dow)) return;
      const ts = new Date(day + "T" + t + ":00").getTime() - S.sim.off * 60000;
      if (created(m) > ts + 3600000) return;
      out.push({ id: slot + "@" + t, slot: +slot, time: t, med: m });
    });
  }
  return out.sort((a, b) => a.time.localeCompare(b.time));
}
const lgGet = (id) => S.log[dk(now()) + "|" + id];
const lg = (id) => {
  const k = dk(now()) + "|" + id;
  return (
    S.log[k] ||
    (S.log[k] = {
      alerted: false,
      alertAt: 0,
      rem: 0,
      opened: null,
      conf: null,
      confAt: 0,
      res: null,
    })
  );
};
function dState(d) {
  const l = lgGet(d.id) || {};
  if (l.res === "tomada") return ["ok", "Confirmada"];
  if (l.res === "perdida") return ["bad", "Perdida"];
  if (l.res === "sem") return ["warn", "Sem confirmação"];
  const mins = toMin(d.time) - toMin(hm(now()));
  if (mins > 0) return ["", mins <= 60 ? "Em " + mins + " min" : "Agendada"];
  return ["warn", l.conf === "sim" ? "Aguardando sincronização" : "Pendente"];
}
/* estoque (RF10, RF23, RF24, RF29) */
const perDay = (m) => m.qty * (m.times || []).length,
  daysLeft = (m) => (perDay(m) ? Math.floor(m.stock / perDay(m)) : 999);
function stk(m) {
  const d = daysLeft(m),
    lim = S.cfg.days;
  return m.stock <= 0
    ? ["bad", "Esgotado", d]
    : d <= Math.min(3, lim)
      ? ["bad", "Acabando", d]
      : d <= lim
        ? ["warn", "Atenção", d]
        : ["ok", "Em dia", d];
}
const lowMeds = () => Object.values(S.meds).filter((m) => stk(m)[0] !== "ok");
/* alarmes escalonados (RF19 a RF25, RNF04) */
let beepT = null;
function beep() {
  stopBeep();
  try {
    const A = new (window.AudioContext || window.webkitAudioContext)();
    let n = 0;
    beepT = setInterval(() => {
      if (n++ > 10) {
        stopBeep();
        return;
      }
      const o = A.createOscillator(),
        g = A.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.08;
      o.connect(g);
      g.connect(A.destination);
      o.start();
      o.stop(A.currentTime + 0.15);
    }, 700);
  } catch (e) {}
}
function stopBeep() {
  clearInterval(beepT);
  beepT = null;
}
function speak(t) {
  if (!S.cfg.narrate || !window.speechSynthesis) return;
  try {
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "pt-BR";
    speechSynthesis.speak(u);
  } catch (e) {}
}
function notice(ds, text) {
  U.note = { id: ds.id, text };
  if (typeof toast === "function") toast(text);
  if (typeof renderNotify === "function") renderNotify();
}
function alarm(ds) {
  const l = lg(ds.id);
  l.alerted = true;
  l.alertAt = nowMs();
  U.led = ds.slot;
  notice(ds, "Hora da dose: " + ds.med.name + " (" + ds.time + ")");
  if (S.box) beep();
  speak("Hora de tomar " + ds.med.name);
}
function expire(ds) {
  const l = lg(ds.id);
  if (l.res || l.conf === "sim") return;
  l.res = l.opened ? "sem" : "perdida";
  S.history.unshift({
    id: uid(),
    date: dk(now()),
    time: ds.time,
    slot: ds.slot,
    name: ds.med.name,
    box: S.box
      ? l.opened
        ? "Aberta " + hm(new Date(l.opened))
        : "Não aberta"
      : "Sem caixa",
    app: l.conf === "nao" ? "Não tomei" : "Sem resposta",
    res: l.res === "sem" ? "Sem confirmação" : "Perdida",
    ts: Date.now(),
  });
  if (U.led === ds.slot) U.led = null;
  stopBeep();
  U.note = null;
}
function tick() {
  if (!S.users.length) return;
  const nm = toMin(hm(now()));
  let ch = false;
  dosesToday().forEach((ds) => {
    const l = lg(ds.id);
    if (l.res) return;
    const t = toMin(ds.time);
    if (!l.alerted) {
      if (nm >= t && nm - t < 60) {
        alarm(ds);
        ch = true;
      }
      return;
    }
    const el = (nowMs() - l.alertAt) / 60000,
      iv = ds.med.rep && ds.med.rep.on ? +ds.med.rep.iv : 0;
    if (!l.conf && iv && l.rem < 12 && el < 60 && el >= (l.rem + 1) * iv) {
      l.rem++;
      notice(ds, "Lembrete " + (l.rem + 1) + " de 13: " + ds.med.name);
      ch = true;
    }
    if (el >= 60) {
      expire(ds);
      ch = true;
    }
  });
  if (ch) {
    save();
    if (typeof render === "function") render(true);
  }
}
function openSlot(slot) {
  if (!S.box) {
    toast(
      "Sem caixa vinculada: o sensor de abertura não existe no modo digital.",
    );
    return;
  }
  const ds = dosesToday().find(
    (d) =>
      d.slot === slot && lgGet(d.id) && lgGet(d.id).alerted && !lgGet(d.id).res,
  );
  if (!ds) {
    toast("Compartimento " + slot + " aberto, mas não há dose ativa nele.");
    return;
  }
  lg(ds.id).opened = nowMs();
  U.led = null;
  stopBeep();
  save();
  toast("Sensor: compartimento " + slot + " aberto. Alarme interrompido.");
  render(true);
}
function confirmDose(id, ans) {
  const l = lg(id);
  if (ans === "sim") {
    l.conf = "sim";
    l.confAt = nowMs();
    S.queue.push({ id: uid(), t: "conf", dose: id, ts: l.confAt });
    if (String(U.led) === id.split("@")[0]) U.led = null;
    stopBeep();
    U.note = null;
  } else l.conf = "nao";
  save();
  if (S.online) sync();
}
/* conciliação no servidor: baixa de estoque só com confirmação (RF27, RF28, RF31) */
function sync() {
  if (!S.online || !S.queue.length) return 0;
  let n = 0;
  S.queue.forEach((q) => {
    if (q.t !== "conf") return;
    const [slot, time] = q.dose.split("@"),
      m = S.meds[slot],
      l = lg(q.dose);
    if (!m || l.res) return;
    m.stock = Math.max(0, m.stock - m.qty);
    l.res = "tomada";
    S.history.unshift({
      id: uid(),
      date: dk(now()),
      time,
      slot: +slot,
      name: m.name,
      box: S.box
        ? l.opened
          ? "Aberta " + hm(new Date(l.opened))
          : "Não aberta"
        : "Sem caixa",
      app: "Confirmada " + hm(new Date(l.confAt)),
      res: "Tomada",
      ts: Date.now(),
    });
    n++;
  });
  S.queue = [];
  save();
  if (n && typeof toast === "function")
    toast("Sincronizado: " + n + " dose(s) conciliada(s).");
  return n;
}
const adherence = () => {
  const h = S.history;
  if (!h.length) return null;
  return Math.round(
    (h.filter((x) => x.res === "Tomada").length * 100) / h.length,
  );
};
/* pedido simulado (RF42 a RF44) */
const ship = () => SHIP[S.ck.ship || "padrao"][2],
  orderTotal = () => (S.cart ? S.cart.qty * PRICE : 0) + ship();
function placeOrder() {
  const n = String(41 + S.orders.length + 1).padStart(4, "0");
  const o = {
    id: "CM-2026-" + n,
    qty: S.cart.qty,
    ship: S.ck.ship || "padrao",
    addr: S.ck.addr || {},
    pay: S.ck.pay || { m: "pix" },
    total: orderTotal(),
    status: 1,
    ts: [Date.now(), Date.now()],
    user: S.session,
  };
  S.orders.unshift(o);
  S.cart = null;
  mail("pedido", (me() || {}).email, { order: o.id });
  return o;
}
function advanceOrder() {
  const o = S.orders[0];
  if (!o || o.status >= 4) return false;
  o.status++;
  o.ts[o.status] = Date.now();
  if (o.status === 3)
    mail("enviado", (me() || titular() || {}).email, { order: o.id });
  save();
  return true;
}
/* dados de exemplo (para explorar o fluxo) */
function seed() {
  const t = now(),
    base = Date.now() - 86400000 * 2;
  const add = (s, name, dose, qty, times, stock, rep) => {
    S.meds[s] = {
      slot: s,
      name,
      dose,
      unit: "comprimido",
      qty,
      freq: times.length + "x ao dia",
      times,
      days: [0, 1, 2, 3, 4, 5, 6],
      stock,
      total: 60,
      start: dk(t),
      obs: "",
      rep: rep || { on: true, iv: 5 },
      created: base,
    };
  };
  add(1, "Omeprazol", "20mg", 1, ["07:00"], 56);
  add(2, "Vitamina D", "40UI", 1, ["09:30"], 50);
  add(3, "Vitamina B12", "9,94mcg", 1, ["12:00"], 60);
  add(4, "Captopril", "25mg", 1, ["20:00"], 30);
  add(5, "Losartana", "50mg", 1, ["08:00", "20:00"], 5);
  add(6, "Dipirona", "500mg", 1, ["22:00"], 12, { on: false, iv: 5 });
  const h = (d, time, slot, name, res) =>
    S.history.push({
      id: uid(),
      date: dk(new Date(Date.now() - 86400000 * d)),
      time,
      slot,
      name,
      box: res === "Perdida" ? "Não aberta" : "Aberta " + time,
      app:
        res === "Tomada"
          ? "Confirmada " + time
          : res === "Perdida"
            ? "Sem resposta"
            : "Sem confirmação",
      res,
      ts: Date.now() - 86400000 * d,
    });
  h(1, "20:00", 4, "Captopril", "Tomada");
  h(1, "08:00", 5, "Losartana", "Sem confirmação");
  h(2, "20:00", 5, "Losartana", "Perdida");
  h(2, "09:30", 2, "Vitamina D", "Tomada");
  h(2, "07:00", 1, "Omeprazol", "Tomada");
  save();
}
function applyCfg() {
  document.documentElement.style.fontSize = [16, 18, 20][S.cfg.font] + "px";
  document.body.classList.toggle("hc", !!S.cfg.contrast);
}
