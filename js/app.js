"use strict";
/* CronoMed: roteador (hash), eventos por delegação e ligação dos fluxos às regras de store.js.
   data-go="#/rota"  → navegação | data-act="nome" → ACT[nome] | form[data-form="nome"] → FORM[nome] */
const R = (h) => ({ redirect: h }),
  hash = (s) =>
    String(s)
      .split("")
      .reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
      .toString(36); // hash didático (demo, não é segurança real)
let lastRoute = "";
function toast(m) {
  const d = document.createElement("div");
  d.textContent = m;
  $("#toasts").appendChild(d);
  setTimeout(() => d.remove(), 3800);
}
function renderNotify() {
  const n = U.note;
  $("#notify").innerHTML = n
    ? `<div class="n"><span>${ic("bell", 18)} ${esc(n.text)}</span><span class="row"><button class="btn sm" style="background:#fff;color:#1E4F7C" data-act="confirmOpen" data-id="${n.id}">Abrir</button><button class="btn2 sm" style="border-color:#fff;color:#fff;background:transparent" data-act="dismissNote">Dispensar</button></span></div>`
    : "";
}
function renderModal() {
  const m = U.modal;
  $("#modal").innerHTML = m
    ? `<div class="ov"><div class="dlg" role="dialog" aria-modal="true" aria-labelledby="mt">${m}</div></div>`
    : "";
  if (m) {
    const f = $("#modal [data-act],#modal input,#modal button");
    f && f.focus();
  }
}
const openModal = (h) => {
    U.lastFocus = document.activeElement;
    U.modal = h;
    renderModal();
  },
  closeModal = () => {
    U.modal = null;
    renderModal();
    U.lastFocus && U.lastFocus.focus && U.lastFocus.focus();
  };
function renderSim() {
  const ds = dosesToday();
  if (!ds.find((d) => d.id === U.sel)) U.sel = ds[0] ? ds[0].id : "";
  const b = (a, t, x = "") =>
      `<button class="btn2 sm" data-act="${a}" ${x}>${t}</button>`,
    sw = (a, on, t) =>
      `<label class="row sm" style="gap:8px">${tgl(on, a)}${t}</label>`;
  $("#sim").innerHTML = `${
    U.simOpen
      ? `<div class="pn" role="dialog" aria-label="Simulador da caixa e do sistema"><div class="row sp"><b>Simulador</b><button class="btn2 sm" data-act="sim" aria-label="Fechar simulador">${ic("x", 14)}</button></div><p class="mut xs">Dispara os eventos que a caixa, a rede e o servidor gerariam, para você percorrer o fluxo.</p>
<h3>Relógio (${hm(now())})</h3><div class="g">${b("clk", "+5 min", 'data-d="5"')}${b("clk", "+30 min", 'data-d="30"')}${b("clk", "+60 min", 'data-d="60"')}${b("clk", "Voltar", 'data-d="0"')}</div>
<h3>Dose e caixa <span class="led ${U.led ? "on" : ""}"></span></h3><select class="in" data-act="simSel" aria-label="Dose">${ds.map((d) => `<option value="${d.id}" ${U.sel === d.id ? "selected" : ""}>${d.time} · ${esc(d.med.name)}</option>`).join("") || "<option>Sem doses hoje</option>"}</select><div class="g">${b("fire", "Disparar alarme")}${b("sensor", "Abrir compartimento (sensor)")}</div>
<h3>Rede e Bluetooth</h3>${sw("net", S.online, "Online")}${sw("simBt", S.sim.bt, "Bluetooth do aparelho ligado")}${sw("simNear", S.sim.near, "Caixa por perto")}<div class="g">${b("syncNow", "Sincronizar fila (" + S.queue.length + ")")}</div>
<h3>Pedido e dados</h3><div class="g">${b("advOrder", "Avançar pedido")}${b("seedDemo", "Carregar exemplo")}${b("resetDemo", "Reiniciar demo")}${me() && me().role !== "titular" ? b("toTit", "Voltar ao Titular") : ""}</div></div>`
      : ""
  }<button class="fab" data-act="sim" aria-expanded="${U.simOpen}">${ic("sliders", 14)} Simulador</button>`;
}
function resolve() {
  const seg = (location.hash.slice(2) || "").split("/").filter(Boolean),
    [a, b, c] = seg,
    u = me();
  if (!a) return V.landing();
  switch (a) {
    case "pedido":
      switch (b) {
        case "produto":
          return V.produto();
        case "carrinho":
          return V.carrinho();
        case "identificacao":
          return V.pedIdent();
        case "entrega":
          return !S.cart
            ? R("#/pedido/carrinho")
            : !u
              ? R("#/pedido/identificacao")
              : V.pedEntrega();
        case "pagamento":
          if (!u) return R("#/pedido/identificacao");
          if (!S.ck.addr) return R("#/pedido/entrega");
          return V.pedPag();
        case "confirmado":
          return V.pedOk();
        default:
          return R("#/pedido/produto");
      }
    case "entrar":
      return V.entrar();
    case "cadastro":
      return V.cadastro();
    case "verifique-email":
      return V.verifique();
    case "esqueci":
      return V.esqueci();
    case "email-enviado":
      return V.enviado();
    case "nova-senha":
      return V.novaSenha(b);
    case "senha-alterada":
      return V.senhaOk();
    case "emails":
      return V.emails();
    case "convite":
      if (b === "concluido") return u ? V.conviteOk() : R("#/entrar");
      if (U.csId !== b) {
        U.csId = b;
        U.cs = 1;
        U.cd2 = {};
      }
      return V.convite(b);
    case "app":
      if (!u) return R("#/entrar");
      if (!u.ativo) return R("#/verifique-email");
      switch (b) {
        case "configurar-caixa":
          if (!can("dispositivos", "G")) return V.dispositivos();
          if (lastRoute !== "configurar-caixa" && !U.keepBt) U.bt = 1;
          U.keepBt = false;
          return V.caixa();
        case "doses":
          return V.doses();
        case "medicamentos":
          if (c && U.slot !== +c) {
            U.times = null;
            U.draft = null;
          }
          return V.medicamentos(c);
        case "estoque":
          return V.estoque();
        case "historico":
          return V.historico();
        case "compartilhamento":
          return V.compart();
        case "dispositivos":
          return V.dispositivos();
        case "configuracoes":
          return V.config();
        case "alterar-cadastro":
          return V.alterar();
        case "seguranca":
          return V.seg();
        case "pedidos":
          return c ? V.pedido(c) : V.pedidos();
        default:
          return R("#/app/doses");
      }
    default:
      return V.landing();
  }
}
function render(soft) {
  const ae = document.activeElement;
  if (
    soft &&
    ae &&
    /INPUT|TEXTAREA|SELECT/.test(ae.tagName) &&
    ae.closest("#app")
  ) {
    renderNotify();
    renderSim();
    return;
  }
  const r = resolve();
  if (r && r.redirect) {
    location.replace(r.redirect);
    return;
  }
  const el = $("#app"),
    sy = scrollY;
  el.innerHTML = r;
  applyCfg();
  renderNotify();
  renderSim();
  renderModal();
  lastRoute = location.hash.split("/")[2] || "";
  if (soft) scrollTo(0, sy);
  else {
    scrollTo(0, 0);
    if (U.scrollT) {
      const t = U.scrollT;
      U.scrollT = null;
      setTimeout(() => {
        const x = document.getElementById(t);
        x && x.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }
}
const go = (h) => {
  if (location.hash === h) render();
  else location.hash = h;
};
/* ---------- utilidades de formulário ---------- */
const MASK = {
  cpf: (v) => {
    v = v.replace(/\D/g, "").slice(0, 11);
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  },
  cep: (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, "$1-$2"),
  phone: (v) => {
    v = v.replace(/\D/g, "").slice(0, 11);
    return v.length > 10
      ? v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  },
  card: (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 "),
};
const clearErr = (f) => {
  $$(".err", f).forEach((e) => (e.textContent = ""));
  $$(".in.bad", f).forEach((e) => e.classList.remove("bad"));
};
function fail(f, errs) {
  const k = Object.keys(errs);
  if (!k.length) return false;
  k.forEach((n) => {
    const e = $('[data-err="' + n + '"]', f);
    if (e) e.textContent = errs[n];
    const i = f.elements[n];
    i && i.classList && i.classList.add("bad");
  });
  const first = f.elements[k[0]];
  first && first.focus && first.focus();
  return true;
}
const cap = (sel) => {
  const f = $(sel);
  return f ? Object.fromEntries(new FormData(f)) : {};
};
const chkUpdate = (v) =>
  $$("#chk li").forEach((li, i) => li.classList.toggle("ok", pwChecks(v)[i]));
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
function csv() {
  const rows = [
    [
      "Data",
      "Hora",
      "Compartimento",
      "Medicamento",
      "Caixa",
      "App",
      "Resultado",
    ],
    ...S.history.map((h) => [
      h.date,
      h.time,
      h.slot,
      h.name,
      h.box,
      h.app,
      h.res,
    ]),
  ];
  const blob = new Blob(
    [
      "\ufeff" +
        rows
          .map((r) =>
            r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(";"),
          )
          .join("\n"),
    ],
    { type: "text/csv" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "cronomed-historico.csv";
  a.click();
  toast("Histórico exportado em CSV.");
}
let cdT = null;
function startCd() {
  U.cd = 60;
  clearInterval(cdT);
  cdT = setInterval(() => {
    U.cd--;
    const b = $("#resend") || $('[data-act="resendReset"]');
    if (b) {
      b.textContent =
        U.cd > 0 ? "Reenviar em " + U.cd + " s" : "Reenviar e-mail";
      b.disabled = U.cd > 0;
    }
    if (U.cd <= 0) clearInterval(cdT);
  }, 1000);
}
function newUser(d, role = "titular") {
  const u = {
    id: uid(),
    nome: d.nome.trim(),
    cpf: d.cpf,
    email: d.email.trim().toLowerCase(),
    senha: hash(d.senha),
    ativo: role !== "titular",
    role,
  };
  S.users.push(u);
  return u;
}
function validAcc(d, extra = {}) {
  const e = {};
  if (words(d.nome || "") < 2) e.nome = "Informe o nome completo.";
  if (!cpfOk(d.cpf || "")) e.cpf = "CPF inválido.";
  if (!emailOk(d.email || "")) e.email = "E-mail inválido.";
  else if (S.users.some((u) => u.email === d.email.trim().toLowerCase()))
    e.email = "Este e-mail já está cadastrado.";
  else if (S.users.some((u) => u.role === "titular") && !extra.multi)
    e.email =
      "Já existe uma conta neste navegador. Use “Reiniciar demo” no simulador para criar outra.";
  if (!pwOk(d.senha || ""))
    e.senha = "A senha não atende a todos os requisitos.";
  if (d.senha !== d.senha2) e.senha2 = "As senhas não são iguais.";
  return e;
}
/* ---------- formulários ---------- */
const FORM = {
  contato(f, d) {
    const e = {};
    if (!emailOk(d.email || "")) e.email = "E-mail inválido.";
    if (!(d.msg || "").trim()) e.msg = "Escreva uma mensagem.";
    if (fail(f, e)) return;
    toast("Mensagem enviada. Obrigado!");
    f.reset();
  },
  cadastro(f, d) {
    const e = validAcc(d);
    if (fail(f, e)) return;
    const u = newUser(d);
    mail("ativacao", u.email, { nome: u.nome, user: u.id });
    U.pending = u.id;
    startCd();
    audit("criou a conta");
    save();
    go("#/verifique-email");
  },
  ckCadastro(f, d) {
    const e = validAcc(d);
    if (!d.termos) e.termos = "Aceite os termos para continuar.";
    if (fail(f, e)) return;
    const u = newUser(d);
    mail("ativacao", u.email, { nome: u.nome, user: u.id });
    S.session = u.id;
    U.pending = u.id;
    save();
    toast("Conta criada. O e-mail de ativação foi enviado.");
    go("#/pedido/entrega");
  },
  login(f, d) {
    const id = (d.id || "").trim().toLowerCase(),
      dg = id.replace(/\D/g, ""),
      u = S.users.find(
        (x) =>
          x.email === id ||
          (dg.length === 11 && x.cpf.replace(/\D/g, "") === dg),
      );
    if (!u || u.senha !== hash(d.senha || "")) {
      fail(f, {
        geral: "Não foi possível entrar. Confira o e-mail ou CPF e a senha.",
      });
      return;
    }
    if (!u.ativo) {
      mail("ativacao", u.email, { nome: u.nome, user: u.id });
      U.pending = u.id;
      fail(f, {
        geral: "Conta ainda não ativada. Reenviamos o e-mail de ativação.",
      });
      startCd();
      return;
    }
    const sh = S.shares.find((s) => s.userId === u.id);
    if (sh && sh.status === "pausado") {
      fail(f, { geral: "Seu acesso está pausado pelo Titular." });
      return;
    }
    S.session = u.id;
    save();
    go("#/app/doses");
  },
  ckLogin(f, d) {
    FORM.login(f, d);
    if (S.session) go("#/pedido/entrega");
  },
  esqueci(f, d) {
    const id = (d.id || "").trim().toLowerCase(),
      dg = id.replace(/\D/g, ""),
      u = S.users.find(
        (x) =>
          x.email === id ||
          (dg.length === 11 && x.cpf.replace(/\D/g, "") === dg),
      );
    if (!id) {
      fail(f, { id: "Informe o e-mail ou o CPF." });
      return;
    }
    if (u) {
      const t = uid();
      S.tokens[t] = { user: u.id, ts: Date.now() };
      mail("redefinicao", u.email, { token: t, nome: u.nome });
    }
    startCd();
    save();
    go("#/email-enviado");
  },
  novaSenha(f, d) {
    const e = {};
    if (!pwOk(d.senha || ""))
      e.senha = "A senha não atende a todos os requisitos.";
    if (d.senha !== d.senha2) e.senha2 = "As senhas não são iguais.";
    if (fail(f, e)) return;
    const t = f.dataset.t,
      k = S.tokens[t];
    if (!k) {
      go("#/nova-senha/" + t);
      return;
    }
    const u = S.users.find((x) => x.id === k.user);
    u.senha = hash(d.senha);
    delete S.tokens[t];
    S.session = null;
    audit("redefiniu a senha");
    save();
    go("#/senha-alterada");
  },
  entrega(f, d) {
    const e = {};
    if (!(d.dest || "").trim()) e.dest = "Informe o destinatário.";
    if ((d.cep || "").length < 9) e.cep = "CEP inválido.";
    ["num", "rua", "bairro", "cidade"].forEach((k) => {
      if (!(d[k] || "").trim()) e[k] = "Campo obrigatório.";
    });
    if (!/^[A-Za-z]{2}$/.test(d.uf || "")) e.uf = "Use 2 letras.";
    if (fail(f, e)) return;
    S.ck.addr = {
      dest: d.dest,
      cep: d.cep,
      num: d.num,
      rua: d.rua,
      comp: d.comp,
      bairro: d.bairro,
      cidade: d.cidade,
      uf: d.uf.toUpperCase(),
    };
    S.ck.ship = d.ship || "padrao";
    U.pay = 1;
    U.payRes = "ok";
    save();
    go("#/pedido/pagamento");
  },
  payForma(f, d) {
    const m = (S.ck.pay || {}).m || "pix",
      e = {};
    if (m === "cartao") {
      if ((d.cartao || "").replace(/\D/g, "").length < 13)
        e.cartao = "Número do cartão inválido (simulação).";
      if (!(d.nomec || "").trim()) e.nomec = "Informe o nome impresso.";
      if (!/^\d{2}\/\d{4}$/.test(d.val || "")) e.val = "Use MM/AAAA.";
      if (!/^\d{3,4}$/.test(d.cvv || "")) e.cvv = "Código inválido.";
    }
    if (fail(f, e)) return;
    S.ck.pay = { m, parc: d.parc || 1 };
    U.pay = 2;
    render();
  },
  sync(f, d) {
    const e = {};
    if (!(d.nome || "").trim()) e.nome = "Dê um nome à caixa.";
    if (!(d.wifi || "").trim()) e.wifi = "Informe a rede.";
    if (!(d.wsenha || "").trim()) e.wsenha = "Informe a senha da rede.";
    if (fail(f, e)) return;
    S.box = {
      nome: d.nome.trim(),
      wifi: d.wifi.trim(),
      sync: Date.now(),
      mac: "A4:CF:12:9B:3F:A9",
    };
    U.boxPw = String(Math.floor(100000 + Math.random() * 900000));
    U.bt = 5;
    audit("configurou a caixa " + S.box.nome);
    save();
    toast("Caixa sincronizada. O plano de horários foi enviado.");
    render();
  },
  med(f, d) {
    const slot = +f.dataset.slot,
      e = {},
      times = [...new Set(U.times)].sort();
    if (!(d.name || "").trim()) e.name = "Informe o nome do medicamento.";
    if (!(d.dose || "").trim()) e.dose = "Informe a dosagem.";
    if (!(+d.qty >= 1)) e.qty = "Mínimo 1.";
    if (d.stock === "" || +d.stock < 0) e.stock = "Informe a quantidade.";
    if (!times.length) e.times = "Adicione ao menos um horário.";
    if (!U.days.length) e.times = "Escolha ao menos um dia da semana.";
    if (fail(f, e)) return;
    const old = S.meds[slot];
    S.meds[slot] = {
      slot,
      name: d.name.trim(),
      dose: d.dose.trim(),
      unit: "comprimido",
      qty: +d.qty,
      times,
      days: [...U.days],
      stock: +d.stock,
      total: Math.max(old ? old.total || 0 : 0, +d.stock),
      obs: d.obs || "",
      rep: { ...U.rep },
      created: old ? old.created : nowMs(),
    };
    U.times = null;
    U.draft = null;
    audit((old ? "atualizou " : "cadastrou ") + d.name.trim());
    save();
    toast(
      S.box
        ? "Salvo. O plano de horários foi enviado à caixa e ao app."
        : "Salvo. No modo digital, o alarme toca no celular.",
    );
    go("#/app/medicamentos");
  },
  refill(f, d) {
    if (!(+d.q >= 1)) {
      fail(f, { q: "Informe a quantidade comprada." });
      return;
    }
    const m = S.meds[f.dataset.slot];
    m.stock += +d.q;
    m.total = Math.max(m.total || 0, m.stock);
    audit("reabasteceu " + m.name);
    save();
    closeModal();
    toast("Estoque atualizado: " + m.stock + " unidades.");
    render();
  },
  invite(f, d) {
    const e = {};
    if (words(d.nome || "") < 2) e.nome = "Informe o nome completo.";
    if (!(d.whats || "").trim() && !(d.email || "").trim())
      e.contato = "Informe pelo menos um contato: WhatsApp ou e-mail.";
    if ((d.email || "").trim() && !emailOk(d.email))
      e.email = "E-mail inválido.";
    if (fail(f, e)) return;
    const perms = {};
    MODS.forEach(([k]) => (perms[k] = d["p_" + k] || "V"));
    const s = {
      id: uid(),
      nome: d.nome.trim(),
      email: (d.email || "").trim().toLowerCase(),
      whats: (d.whats || "").trim(),
      perms,
      status: "pendente",
      tipo: null,
      userId: null,
    };
    S.shares.push(s);
    mail("convite", s.email || s.whats, { share: s.id, nome: s.nome });
    audit("convidou " + s.nome);
    save();
    closeModal();
    toast(
      "Convite enviado por " +
        (s.email && s.whats
          ? "WhatsApp e e-mail"
          : s.whats
            ? "WhatsApp"
            : "e-mail") +
        ".",
    );
    render();
  },
  convite1(f, d) {
    const e = {};
    if (!cpfOk(d.cpf || "")) e.cpf = "CPF inválido.";
    if (!d.tipo) e.tipo = "Escolha o tipo de convidado.";
    if (d.tipo === "enfermeiro" && !(d.coren || "").trim())
      e.coren = "Informe o COREN.";
    if (d.tipo === "medico") {
      if (!(d.crm || "").trim()) e.crm = "Informe o CRM.";
      if (!(d.esp || "").trim()) e.esp = "Informe a especialidade.";
    }
    if (fail(f, e)) return;
    U.cd2 = { ...U.cd2, ...d };
    U.cs = 2;
    render();
  },
  convite2(f, d) {
    const e = {};
    if ((d.tel || "").replace(/\D/g, "").length < 10)
      e.tel = "Telefone inválido.";
    if (fail(f, e)) return;
    U.cd2 = { ...U.cd2, ...d };
    U.cs = 3;
    render();
  },
  convite3(f, d) {
    const e = {};
    if (!pwOk(d.senha || ""))
      e.senha = "A senha não atende a todos os requisitos.";
    if (d.senha !== d.senha2) e.senha2 = "As senhas não são iguais.";
    if (fail(f, e)) return;
    const sh = S.shares.find((s) => s.id === f.dataset.id),
      c = U.cd2;
    const u = newUser(
      {
        nome: sh.nome,
        cpf: c.cpf,
        email: sh.email || "conv" + sh.id.slice(0, 6) + "@exemplo.com",
        senha: d.senha,
      },
      c.tipo,
    );
    u.tel = c.tel;
    u.extra = { coren: c.coren, crm: c.crm, esp: c.esp };
    sh.status = "ativo";
    sh.userId = u.id;
    sh.tipo = c.tipo;
    S.session = u.id;
    audit("aceitou o convite como " + TIPOS[c.tipo]);
    save();
    go("#/convite/concluido");
  },
  alterar(f, d) {
    const e = {};
    if (words(d.nome || "") < 2) e.nome = "Informe o nome completo.";
    if (!emailOk(d.email || "")) e.email = "E-mail inválido.";
    else if (
      S.users.some((x) => x.email === d.email.toLowerCase() && x.id !== me().id)
    )
      e.email = "Este e-mail já está em uso.";
    if (fail(f, e)) return;
    const u = me();
    Object.assign(u, {
      nome: d.nome.trim(),
      email: d.email.toLowerCase(),
      tel: d.tel,
      tel2: d.tel2,
    });
    audit("atualizou o cadastro");
    save();
    toast("Dados atualizados.");
    go("#/app/doses");
  },
  altSenha(f, d) {
    const e = {};
    if (me().senha !== hash(d.atual || "")) e.atual = "Senha atual incorreta.";
    if (!pwOk(d.senha || ""))
      e.senha = "A senha não atende a todos os requisitos.";
    if (d.senha !== d.senha2) e.senha2 = "As senhas não são iguais.";
    if (fail(f, e)) return;
    me().senha = hash(d.senha);
    audit("alterou a senha");
    save();
    f.reset();
    chkUpdate("");
    toast("Senha alterada. As demais sessões foram encerradas.");
  },
};
/* ---------- ações (cliques e mudanças) ---------- */
const ACT = {
  eye(el) {
    const i = $("input", el.closest(".pw"));
    i.type = i.type === "password" ? "text" : "password";
  },
  scroll(el) {
    const t = el.dataset.t;
    if ((location.hash || "#/") !== "#/") {
      U.scrollT = t;
      location.hash = "#/";
    } else {
      const x = document.getElementById(t);
      x && x.scrollIntoView({ behavior: "smooth" });
    }
  },
  menu() {
    U.menu = !U.menu;
    render(true);
  },
  logout() {
    S.session = null;
    U.menu = false;
    save();
    toast("Acesso encerrado.");
    go("#/");
  },
  idtab(el) {
    U.idTab = el.dataset.v;
    render();
  },
  lt(el) {
    U.lt = el.dataset.v;
    render();
  },
  hf(el) {
    U.hf = el.dataset.v;
    render();
  },
  qty(el) {
    const d = +el.dataset.d;
    if (!S.cart) S.cart = { qty: 1 };
    S.cart.qty = Math.max(1, Math.min(5, S.cart.qty + d));
    save();
    render();
  },
  cep() {
    const v = $("#cep").value;
    U.cepMsg =
      v.length === 9
        ? "Frete padrão: " +
          brl(SHIP.padrao[2]) +
          " · " +
          SHIP.padrao[1] +
          ". Expresso: " +
          brl(SHIP.expresso[2]) +
          " · " +
          SHIP.expresso[1] +
          "."
        : "Digite um CEP válido.";
    $("#cepmsg").textContent = U.cepMsg;
  },
  addCart() {
    if (!S.cart) S.cart = { qty: 1 };
    save();
    toast("Caixa CronoMed adicionada ao carrinho.");
    go("#/pedido/carrinho");
  },
  buyNow() {
    if (!S.cart) S.cart = { qty: 1 };
    save();
    go("#/pedido/identificacao");
  },
  rmCart() {
    S.cart = null;
    save();
    render();
  },
  cupom() {
    toast("Cupom indisponível nesta simulação.");
  },
  ship(el) {
    S.ck.ship = el.value;
    save();
    render(true);
  },
  paym(el) {
    S.ck.pay = { m: el.dataset.v };
    render();
  },
  simres(el) {
    U.payRes = el.value;
  },
  payBack() {
    U.pay = 1;
    render();
  },
  payGo() {
    U.pay = 3;
    render();
    setTimeout(() => {
      if (U.payRes === "no") {
        U.pay = 4;
        render();
        return;
      }
      placeOrder();
      U.pay = 4;
      U.payRes = "ok";
      render();
    }, 2000);
  },
  payRetry() {
    U.pay = 1;
    U.payRes = "ok";
    render();
  },
  resend() {
    const u = S.users.find((x) => x.id === U.pending);
    if (u) {
      mail("ativacao", u.email, { nome: u.nome, user: u.id });
      startCd();
      render();
    }
  },
  resendReset() {
    const u = S.users[0];
    if (!u) return;
    const t = uid();
    S.tokens[t] = { user: u.id, ts: Date.now() };
    mail("redefinicao", u.email, { token: t, nome: u.nome });
    startCd();
    render();
  },
  openMail(el) {
    U.mail = el.dataset.id;
    const m = S.emails.find((e) => e.id === U.mail);
    if (m) m.read = true;
    save();
    render();
  },
  clearMail() {
    S.emails = [];
    save();
    render();
  },
  activate(el) {
    const m = S.emails.find((e) => e.id === el.dataset.id),
      u = m && S.users.find((x) => x.email === m.to);
    if (!u) {
      toast("Conta não encontrada.");
      return;
    }
    u.ativo = true;
    S.session = u.id;
    m.read = true;
    audit("ativou a conta");
    save();
    toast("Conta ativada. Vamos configurar a sua caixa.");
    go("#/app/configurar-caixa");
  },
  goOrder(el) {
    const u = me();
    if (u && u.ativo) go("#/app/pedidos/" + el.dataset.o);
    else {
      toast("Entre na sua conta para acompanhar o pedido.");
      go("#/entrar");
    }
  },
  /* configuração da caixa por Bluetooth (RF45, RF46) */
  btOn() {
    if (!S.sim.bt) {
      U.bt = 1;
      render();
      return;
    }
    U.bt = 2;
    U.scan = true;
    render();
    setTimeout(() => {
      U.scan = false;
      render();
    }, 1500);
  },
  btFound() {
    U.bt = 3;
    render();
  },
  btPair() {
    U.pairing = true;
    render();
    setTimeout(() => {
      U.pairing = false;
      U.bt = 4;
      render();
    }, 1000);
  },
  later() {
    toast("Tudo bem: você usa o modo digital até configurar a caixa.");
    go("#/app/doses");
  },
  rewifi() {
    U.keepBt = true;
    U.bt = 4;
    go("#/app/configurar-caixa");
  },
  revoke() {
    openModal(
      M.ask(
        "Revogar dispositivo",
        "A caixa deixa de enviar e receber dados e o sistema volta ao modo digital.",
        "revokeYes",
        "",
      ),
    );
  },
  revokeYes() {
    S.box = null;
    audit("revogou a caixa");
    save();
    closeModal();
    toast("Dispositivo revogado.");
    render();
  },
  /* doses e confirmação (RF18, RF26 a RF28) */
  confirmOpen(el) {
    const id = el.dataset.id;
    if (!can("doses", "G")) {
      toast("Seu acesso a Próximas doses é de Visualização.");
      return;
    }
    openModal(M.confirmar(id));
    speak("Você tomou o medicamento?");
  },
  confirmYes(el) {
    confirmDose(el.dataset.id, "sim");
    closeModal();
    toast(
      S.online
        ? "Dose confirmada. Estoque atualizado."
        : "Dose confirmada. Será sincronizada quando houver conexão.",
    );
    render();
  },
  confirmNo(el) {
    confirmDose(el.dataset.id, "nao");
    closeModal();
    toast("Registrado: a dose segue pendente e o lembrete continua.");
    render();
  },
  voice(el) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition,
      m = $("#vmsg"),
      id = el.dataset.id;
    if (!SR) {
      m.textContent = "Reconhecimento de voz indisponível aqui: use os botões.";
      return;
    }
    try {
      const r = new SR();
      r.lang = "pt-BR";
      m.textContent = "Ouvindo…";
      r.onresult = (ev) => {
        const t = ev.results[0][0].transcript.toLowerCase();
        if (/\bsim\b|tomei/.test(t)) ACT.confirmYes({ dataset: { id } });
        else if (/n[aã]o|ainda/.test(t)) ACT.confirmNo({ dataset: { id } });
        else m.textContent = "Não entendi. Use os botões.";
      };
      r.onerror = () => {
        m.textContent = "Voz indisponível ou sem permissão. Use os botões.";
      };
      r.start();
    } catch (x) {
      m.textContent = "Voz indisponível. Use os botões.";
    }
  },
  dismissNote() {
    U.note = null;
    renderNotify();
  },
  closeModal,
  /* medicamentos (RF05 a RF13) */
  timeSet(el) {
    U.times[+el.dataset.i] = el.value;
  },
  timeAdd() {
    U.draft = cap("form[data-form=med]");
    U.draftSlot = U.slot;
    U.times.push("12:00");
    render();
  },
  timeDel(el) {
    U.draft = cap("form[data-form=med]");
    U.draftSlot = U.slot;
    U.times.splice(+el.dataset.i, 1);
    render();
  },
  dayTgl(el) {
    U.draft = cap("form[data-form=med]");
    U.draftSlot = U.slot;
    const i = +el.dataset.i;
    U.days = U.days.includes(i)
      ? U.days.filter((x) => x !== i)
      : [...U.days, i];
    render();
  },
  repTgl() {
    U.draft = cap("form[data-form=med]");
    U.draftSlot = U.slot;
    U.rep.on = !U.rep.on;
    render();
  },
  repIv(el) {
    U.draft = cap("form[data-form=med]");
    U.draftSlot = U.slot;
    U.rep.iv = +el.dataset.v;
    render();
  },
  medDel(el) {
    openModal(
      M.ask(
        "Excluir medicamento",
        "Esta ação remove o medicamento e os horários dele. Deseja continuar?",
        "medDelYes",
        'data-slot="' + el.dataset.slot + '"',
      ),
    );
  },
  medDelYes(el) {
    const m = S.meds[el.dataset.slot];
    delete S.meds[el.dataset.slot];
    audit("excluiu " + m.name);
    save();
    closeModal();
    toast("Medicamento excluído.");
    go("#/app/medicamentos");
  },
  refill(el) {
    openModal(M.refill(el.dataset.slot));
  },
  csv,
  /* compartilhamento e permissões por módulo (RF39 a RF41) */
  invite() {
    openModal(M.invite());
  },
  permPick(el) {
    const row = el.closest(".row"),
      k = el.dataset.k,
      v = el.dataset.v;
    $$("button", row).forEach((b) => b.classList.toggle("on", b === el));
    $$('input[name="p_' + k + '"]', row).forEach(
      (r) => (r.checked = r.value === v),
    );
  },
  perm(el) {
    const s = S.shares.find((x) => x.id === el.dataset.id);
    s.perms[el.dataset.m] = el.value;
    audit(
      "alterou " +
        el.dataset.m +
        " de " +
        s.nome +
        " para " +
        (el.value === "G" ? "Gerenciamento" : "Visualização"),
    );
    save();
    toast("Nível atualizado.");
  },
  shPause(el) {
    const s = S.shares.find((x) => x.id === el.dataset.id);
    if (s.status === "pendente") {
      toast("O convite ainda não foi aceito.");
      return;
    }
    s.status = s.status === "ativo" ? "pausado" : "ativo";
    audit((s.status === "ativo" ? "reativou " : "pausou ") + s.nome);
    save();
    render();
  },
  shDel(el) {
    openModal(
      M.ask(
        "Excluir acesso",
        "A pessoa perde o acesso imediatamente e as sessões dela são encerradas.",
        "shDelYes",
        'data-id="' + el.dataset.id + '"',
      ),
    );
  },
  shDelYes(el) {
    const s = S.shares.find((x) => x.id === el.dataset.id);
    S.shares = S.shares.filter((x) => x !== s);
    if (s.userId) S.users = S.users.filter((u) => u.id !== s.userId);
    audit("excluiu o acesso de " + s.nome);
    save();
    closeModal();
    toast("Acesso excluído.");
    render();
  },
  tipo(el) {
    U.cd2 = { ...U.cd2, ...cap("form[data-form=convite1]"), tipo: el.value };
    render();
  },
  csBack() {
    U.cd2 = { ...U.cd2, ...cap("form[data-form^=convite]") };
    U.cs = Math.max(1, U.cs - 1);
    render();
  },
  /* configurações, conta e segurança */
  cfg(el) {
    const k = el.dataset.k;
    S.cfg[k] = !S.cfg[k];
    applyCfg();
    save();
    render(true);
  },
  font(el) {
    S.cfg.font = +el.dataset.v;
    applyCfg();
    save();
    render(true);
  },
  days(el) {
    S.cfg.days = Math.max(1, Math.min(15, S.cfg.days + +el.dataset.d));
    save();
    render(true);
  },
  bio() {
    S.bio = !S.bio;
    save();
    toast(
      S.bio
        ? "Biometria ativada (simulada): o app a pedirá ao abrir."
        : "Biometria desativada.",
    );
    render(true);
  },
  delAcc() {
    openModal(
      M.ask(
        "Excluir conta",
        "Todos os dados deste navegador serão apagados. Esta ação não pode ser desfeita.",
        "delAccYes",
        "",
      ),
    );
  },
  delAccYes() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    S = fresh();
    U.modal = null;
    closeModal();
    toast("Conta excluída.");
    go("#/");
  },
  /* simulador (eventos da caixa, da rede e do servidor) */
  sim() {
    U.simOpen = !U.simOpen;
    renderSim();
  },
  simSel(el) {
    U.sel = el.value;
  },
  clk(el) {
    const d = +el.dataset.d;
    S.sim.off = d === 0 ? 0 : S.sim.off + d;
    save();
    tick();
    render(true);
  },
  fire() {
    const ds = dosesToday().find((d) => d.id === U.sel);
    if (!ds) {
      toast("Cadastre um medicamento primeiro.");
      return;
    }
    if (!lgGet(ds.id) || !lgGet(ds.id).alerted) {
      alarm(ds);
      save();
      render(true);
    } else toast("Esse alarme já foi disparado.");
  },
  sensor() {
    const ds = dosesToday().find((d) => d.id === U.sel);
    ds ? openSlot(ds.slot) : toast("Nenhuma dose selecionada.");
  },
  net() {
    S.online = !S.online;
    save();
    if (S.online) sync();
    toast(
      S.online
        ? "Online: fila sincronizada."
        : "Offline: as ações ficam na fila local.",
    );
    render(true);
  },
  simBt() {
    S.sim.bt = !S.sim.bt;
    save();
    renderSim();
  },
  simNear() {
    S.sim.near = !S.sim.near;
    save();
    renderSim();
  },
  syncNow() {
    const n = sync();
    toast(n ? "Fila sincronizada." : "Nada na fila ou sem conexão.");
    render(true);
  },
  advOrder() {
    toast(
      advanceOrder()
        ? "Pedido avançou para: " + PSTEPS[S.orders[0].status]
        : "Nenhum pedido a avançar.",
    );
    render(true);
  },
  seedDemo() {
    if (!me()) {
      toast("Crie e ative uma conta antes.");
      return;
    }
    seed();
    toast("Dados de exemplo carregados.");
    render(true);
  },
  resetDemo() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    stopBeep();
    S = fresh();
    Object.assign(U, {
      note: null,
      led: null,
      modal: null,
      menu: false,
      pay: 1,
      bt: 1,
      times: null,
      draft: null,
    });
    toast("Demo reiniciada.");
    go("#/");
    render();
  },
  toTit() {
    const t = titular();
    if (t) {
      S.session = t.id;
      go("#/app/doses");
    }
  },
};
/* ---------- eventos globais ---------- */
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.classList && t.classList.contains("ov")) {
    closeModal();
    return;
  }
  const g = t.closest("[data-go]");
  if (g) {
    e.preventDefault();
    U.menu = false;
    location.hash = g.dataset.go;
    return;
  }
  const a = t.closest("[data-act]");
  if (a && !a.disabled && !/^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) {
    const f = ACT[a.dataset.act];
    if (f) f(a, e);
    return;
  }
  if (U.menu && !t.closest(".menu")) {
    U.menu = false;
    render(true);
  }
});
document.addEventListener("change", (e) => {
  const a = e.target.closest("[data-act]");
  if (a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) {
    const f = ACT[a.dataset.act];
    f && f(a, e);
  }
});
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.mask) t.value = MASK[t.dataset.mask](t.value);
  if (t.dataset && t.dataset.live === "pw") chkUpdate(t.value);
  if (t.classList && t.classList.contains("bad")) {
    t.classList.remove("bad");
    const er = t.closest(".fld");
    er && $(".err", er) && ($(".err", er).textContent = "");
  }
});
document.addEventListener("submit", (e) => {
  const f = e.target.closest("form[data-form]");
  if (!f) return;
  e.preventDefault();
  clearErr(f);
  const fn = FORM[f.dataset.form];
  fn && fn(f, Object.fromEntries(new FormData(f)));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (U.modal) closeModal();
    else if (U.menu) {
      U.menu = false;
      render(true);
    }
  }
  if (
    (e.key === "Enter" || e.key === " ") &&
    e.target.matches &&
    e.target.matches("[role=button][data-act]")
  ) {
    e.preventDefault();
    ACT[e.target.dataset.act](e.target, e);
  }
  if (e.key === "Tab" && U.modal) {
    const f = $$(
      "#modal button,#modal input,#modal select,#modal textarea,#modal a",
    ).filter((x) => !x.disabled && x.offsetParent);
    if (f.length) {
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && i === f.length - 1) {
        e.preventDefault();
        f[0].focus();
      }
    }
  }
});
window.addEventListener("hashchange", () => {
  U.menu = false;
  render();
});
/* ---------- inicialização ---------- */
load();
applyCfg();
setInterval(tick, 5000);
window.addEventListener("online", () => {
  S.online = true;
  sync();
  render(true);
});
render();
