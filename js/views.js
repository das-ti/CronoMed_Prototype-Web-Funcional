"use strict";
/* CronoMed: páginas (HTML). Cada V.* devolve o HTML de uma tela; os eventos ficam em app.js (data-go, data-act, data-form). */
const I = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pill: '<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="M8.5 8.5l7 7"/>',
  stock: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/>',
  history:
    '<path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.7L3 8"/><path d="M3 3v5h5M12 8v4l3 2"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4 1.7 4 4"/>',
  device:
    '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 13h18M8 8V5h8v3"/>',
  sliders:
    '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  logout: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
  bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 21h4"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  wifi: '<path d="M2 9a15 15 0 0120 0M5 13a10 10 0 0114 0M8.5 16.5a5 5 0 017 0"/>',
  bat: '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  finger:
    '<path d="M12 11a2 2 0 00-2 2c0 2 .5 4 1.5 6M8 8a5 5 0 018 3c0 3 .5 5 1.5 7M5 12a7 7 0 0111-5.5M12 7a4 4 0 014 4M9 20c-.8-1.5-1-3-1-5M15 14c0 2 .4 3.4 1 4.5"/>',
  bt: '<path d="M7 7l10 10-5 4V3l5 4L7 17"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12H19l2-8H6"/>',
};
const ic = (n, s = 18) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const logoMark = (s = 30, dark) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 52 52" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#F7F5EE" stroke="${dark ? "#fff" : "#1E4F7C"}" stroke-width="4.5"/><path d="M24 7.5v3M24 37.5v3M7.5 24h3M37.5 24h3" stroke="#1E4F7C" stroke-width="2" stroke-linecap="round"/><path d="M24 24V12.5M24 24l7.5 6" stroke="#1E4F7C" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="24" cy="24" r="2.6" fill="#1E4F7C"/><g transform="rotate(-45 37 37)"><rect x="27" y="32" width="20" height="10" rx="5" fill="#fff" stroke="#fff" stroke-width="5"/><rect x="27" y="32" width="20" height="10" rx="5" fill="#fff" stroke="#1E4F7C" stroke-width="2.4"/><path d="M32 32h5v10h-5a5 5 0 010-10z" fill="#1E4F7C"/></g></svg>`;
const logo = (s = 30, dark) =>
  `<span class="logo ${dark ? "dark" : ""}">${logoMark(s, dark)}<span><b>Crono</b><b>Med</b></span></span>`;
const badge = (n, s = 34) => {
  const c = CORES[n - 1];
  return `<svg class="bdg" width="${s}" height="${s}" viewBox="0 0 40 40" role="img" aria-label="Compartimento ${n}, ${c[0].toLowerCase()} com ${c[2].toLowerCase()}"><rect x="1.5" y="1.5" width="37" height="37" rx="9" fill="${c[1]}" stroke="#1A1A1A" stroke-width="2"/><rect x="1.5" y="1.5" width="37" height="37" rx="9" fill="url(#cmp${n})"/><circle cx="20" cy="20" r="10.5" fill="#fff" stroke="#1A1A1A" stroke-width="1.6"/><text x="20" y="25.6" text-anchor="middle" font-size="15.5" font-weight="900" fill="#1A1A1A">${n}</text></svg>`;
};
const chip = (k, t, i) =>
  `<span class="chip ${k}">${i ? ic(i, 13) : ""}${esc(t)}</span>`;
const field = (l, n, o = {}) =>
  `<div class="fld ${o.cls || ""}"><label class="lab" for="f_${n}">${l}</label><input class="in" id="f_${n}" name="${n}" type="${o.type || "text"}" value="${esc(o.v ?? "")}" placeholder="${esc(o.ph || "")}" ${o.m ? `data-mask="${o.m}"` : ""} ${o.ro ? "readonly" : ""} ${o.min != null ? `min="${o.min}"` : ""} autocomplete="${o.ac || "off"}"><div class="err" data-err="${n}"></div>${o.hint ? `<div class="hint">${o.hint}</div>` : ""}</div>`;
const pwf = (l, n, live) =>
  `<div class="fld"><label class="lab" for="f_${n}">${l}</label><div class="pw"><input class="in" id="f_${n}" name="${n}" type="password" ${live ? 'data-live="pw"' : ""} autocomplete="new-password"><button type="button" class="eye" data-act="eye" aria-label="Mostrar ou ocultar a senha">${ic("eye", 20)}</button></div><div class="err" data-err="${n}"></div></div>`;
const checklist = () =>
  `<ul class="chk" id="chk">${["8 caracteres", "1 letra maiúscula", "1 letra minúscula", "1 número", "1 caractere especial (!@#$%)"].map((t) => `<li>${ic("check", 12)}${t}</li>`).join("")}</ul>`;
const tgl = (on, act, extra = "") =>
  `<button type="button" class="tgl" role="switch" aria-checked="${!!on}" data-act="${act}" ${extra}></button>`;
const seg = (opts, cur, act) =>
  `<div class="seg" role="tablist">${opts.map(([k, t]) => `<button type="button" class="${cur === k ? "on" : ""}" data-act="${act}" data-v="${k}" role="tab" aria-selected="${cur === k}">${t}</button>`).join("")}</div>`;
const when = (ms) =>
  new Date(ms).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
/* ---------- shells ---------- */
const pubHead = () =>
  `<header class="pub"><a href="#/" class="row" aria-label="CronoMed, página inicial">${logo()}</a><nav aria-label="Principal"><button data-act="scroll" data-t="como">Como funciona</button><button data-act="scroll" data-t="caixa">A caixa</button><button data-act="scroll" data-t="faq">Dúvidas</button><a href="#/emails">E-mails</a></nav><div class="row">${S.session ? '<a class="btn2 sm" href="#/app/doses">Meu painel</a>' : '<a class="btn2 sm" href="#/entrar">Entrar</a>'}<a class="btn sm" href="#/pedido/produto">Faça seu pedido</a></div></header>`;
const pubFoot = () =>
  `<footer class="foot"><div class="row sp wrap">${logo(28, true)}<span class="sm">Política de privacidade (LGPD) · Acessibilidade · Contato</span></div><p class="xs" style="opacity:.7;margin-top:12px">© 2026 CronoMed · FATEC Praia Grande · Tecnologia em Desenvolvimento de Software Multiplataforma</p></footer>`;
const shopShell = (body, step) => {
  const st = ["Identificação", "Entrega", "Pagamento", "Confirmação"];
  return `${pubHead()}<main class="shop">${step ? `<ol class="steps" style="list-style:none;padding:0">${st.map((t, i) => `<li class="row ${i + 1 <= step ? "on" : ""}" style="gap:8px"><span class="n">${i + 1}</span>${t}${i < 3 ? '<span style="width:28px;height:2px;background:var(--bd)"></span>' : ""}</li>`).join("")}</ol>` : ""}${body}</main>`;
};
const authShell = (inner) =>
  `<div class="auth"><aside><a href="#/">${logo(40, true)}</a><h2>Sua medicação organizada, no horário certo.</h2><p style="opacity:.88">Alarmes na caixa e no celular, confirmação por toque ou voz e acompanhamento por quem cuida de você.</p><div class="box3" style="margin-top:12px;background:rgba(255,255,255,.12);box-shadow:none">${[1, 2, 3, 4, 5, 6].map((n) => `<div class="t" style="padding:8px;border-width:1.5px">${badge(n, 40)}</div>`).join("")}</div></aside><div class="form"><main>${inner}</main></div></div>`;
const NAV = [
  ["doses", "Próximas Doses", "clock"],
  ["medicamentos", "Gerenciar Medicamentos", "pill"],
  ["estoque", "Estoque", "stock"],
  ["historico", "Histórico", "history"],
  ["compartilhamento", "Compartilhamento", "users"],
  ["dispositivos", "Dispositivos", "device"],
  ["configuracoes", "Configurações", "sliders"],
];
const MENU = [
  ["alterar-cadastro", "Alterar cadastro", "user"],
  ["seguranca", "Segurança", "lock"],
  ["compartilhamento", "Compartilhamento", "users"],
  ["pedidos", "Meus pedidos", "stock"],
  ["dispositivos", "Dispositivos", "device"],
  ["configuracoes", "Configurações", "sliders"],
];
function portal(active, title, sub, body) {
  const u = me(),
    ini = u.nome
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
    unread = S.emails.filter((e) => !e.read).length;
  return `<div class="portal"><aside class="side" aria-label="Menu lateral"><a href="#/app/doses" style="padding:0 8px 22px">${logo()}</a>${NAV.map(([k, t, i]) => `<a class="nav ${active === k ? "on" : ""}" href="#/app/${k}" ${active === k ? 'aria-current="page"' : ""}>${ic(i)}${t}</a>`).join("")}<div style="flex:1"></div><button class="nav" style="color:var(--bad);border-top:1px solid var(--bd);border-radius:0" data-act="logout">${ic("logout")}Encerrar Acesso</button></aside>
<div><header class="top"><div class="grow"><h1 style="font-size:1.35rem">${title}</h1>${sub ? `<div class="mut sm">${sub}</div>` : ""}</div><div class="row"><a class="iconbtn" href="#/emails" aria-label="Alertas e e-mails">${ic("bell", 20)}${unread ? `<span class="dot">${unread}</span>` : ""}</a><div class="row who"><span class="avatar">${ini}</span><div class="sm"><div class="b">${esc(u.nome.split(" ").slice(0, 2).join(" "))}</div><div class="mut xs">${u.role === "titular" ? "Titular da conta" : TIPOS[u.role]}</div></div></div><button class="iconbtn" data-act="menu" aria-label="Menu do usuário" aria-expanded="${U.menu}">${ic("menu", 22)}</button></div></header>
${
  U.menu
    ? `<div class="menu" role="menu">${MENU.filter(
        (m) => m[0] !== "pedidos" || isT(),
      )
        .map(
          ([k, t, i]) =>
            `<a role="menuitem" href="#/app/${k}">${ic(i, 20)}${t}</a>`,
        )
        .join(
          "",
        )}<button role="menuitem" data-act="logout" style="color:var(--bad)">${ic("logout", 20)}Encerrar acesso</button></div>`
    : ""
}
<main class="content">${body}</main></div>
<nav class="bnav" aria-label="Abas">${[
    ["doses", "Doses", "clock"],
    ["medicamentos", "Remédios", "pill"],
    ["estoque", "Estoque", "stock"],
    ["historico", "Histórico", "history"],
  ]
    .map(
      ([k, t, i]) =>
        `<a class="${active === k ? "on" : ""}" href="#/app/${k}">${ic(i, 22)}${t}</a>`,
    )
    .join("")}</nav></div>`;
}
const denied = (t) =>
  `<div class="card c" style="padding:40px"><div style="color:var(--mut)">${ic("lock", 36)}</div><h2 style="margin:10px 0 6px">Sem acesso a ${t}</h2><p class="mut">O Titular não liberou este módulo para o seu perfil, ou o acesso está pausado.</p></div>`;
const viewOnly = (m) =>
  can(m, "G")
    ? ""
    : `<div class="banner info">${ic("eye", 20)}<span>Você tem acesso de <b>Visualização</b> neste módulo. As ações de gerenciamento estão desativadas.</span></div>`;
const digitalBanner = () =>
  S.box
    ? ""
    : `<div class="banner warn" role="note">${ic("alert", 22)}<div class="grow"><b>Sua caixa ainda não foi configurada.</b> Por enquanto, o CronoMed funciona só no digital: lembretes no celular, confirmação de doses, estoque e compartilhamento. Luz e som na caixa, sensor de abertura e alerta de bateria começam depois que você a configurar.${can("dispositivos", "G") ? `<div style="margin-top:10px"><a class="btn sm" href="#/app/configurar-caixa">Configurar caixa</a></div>` : ""}</div></div>`;
const summary = (extra = "") => {
  const q = S.cart ? S.cart.qty : 1;
  return `<aside class="card" aria-label="Resumo do pedido"><h3 style="margin-bottom:14px">Resumo do pedido</h3><div class="row" style="padding-bottom:14px;border-bottom:1px solid var(--bd)"><div class="box3" style="padding:6px;gap:3px;border-radius:10px;width:72px;box-shadow:none">${[1, 2, 3, 4, 5, 6].map((n) => `<i style="height:10px;border-radius:3px;background:${CORES[n - 1][1]};border:1px solid #1A1A1A"></i>`).join("")}</div><div class="grow"><div class="b">Caixa CronoMed</div><div class="mut xs">Quantidade: ${q}</div></div><b>${brl(q * PRICE)}</b></div><div class="col sm" style="gap:8px;padding:14px 0"><div class="row sp"><span class="mut">Subtotal</span><span>${brl(q * PRICE)}</span></div><div class="row sp"><span class="mut">Frete</span><span>${brl(ship())}</span></div></div><div class="row sp" style="border-top:1px solid var(--bd);padding-top:14px"><b>Total</b><b style="font-size:1.4rem;color:var(--p)">${brl(q * PRICE + ship())}</b></div>${extra}<p class="mut xs" style="margin-top:10px">Valores ilustrativos.</p></aside>`;
};
const V = {};
/* ---------- landing ---------- */
V.landing =
  () => `${pubHead()}<section class="sec hero"><div><span class="chip ok">Caixa inteligente + aplicativo + painel</span><h1>Cada remédio na hora certa. Quem cuida de você, por perto.</h1><p class="mut" style="font-size:1.1rem;max-width:520px">O CronoMed une uma caixa de medicamentos com alarme, um aplicativo e um painel compartilhado. Você lembra, confirma e quem você escolher acompanha.</p><div class="row wrap" style="margin:24px 0"><a class="btn" href="#/pedido/produto">Faça seu pedido</a><a class="btn2" href="#/cadastro">Criar minha conta</a></div><ul class="row wrap" style="list-style:none;padding:0;gap:8px 22px;font-weight:500;font-size:.9rem">${["Alarmes funcionam sem internet", "Dados protegidos pela LGPD", "Você decide quem acompanha"].map((t) => `<li class="row" style="gap:6px;color:var(--p)">${ic("check")}<span style="color:var(--ink)">${t}</span></li>`).join("")}</ul></div><div class="box3" role="img" aria-label="Caixa com seis compartimentos, o 1 aceso">${[1, 2, 3, 4, 5, 6].map((n) => `<div class="t ${n === 1 ? "lit" : ""}">${badge(n, 64)}</div>`).join("")}</div></section>
<section class="sec alt" id="como"><div class="c" style="max-width:720px;margin:0 auto 32px"><div class="kick">Como o CronoMed ajuda</div><h2 style="font-size:2rem;margin:8px 0">Uma caixa que lembra. Um app que confirma. Um painel que une quem cuida.</h2></div><div class="grid3">${[
    [
      "Guarde",
      "Cada remédio ganha um compartimento com cor, padrão e número. Você cadastra pelo site ou pelo app.",
    ],
    [
      "Receba o alarme",
      "Na hora da dose, a caixa toca e acende na cor do compartimento. O celular avisa junto.",
    ],
    [
      "Confirme e compartilhe",
      "Confirme por toque ou voz. O histórico e o estoque aparecem no painel de quem você autorizar.",
    ],
  ]
    .map(
      ([t, p], i) =>
        `<div class="card"><span class="avatar" style="background:var(--p);color:#fff">${i + 1}</span><h3 style="margin:14px 0 6px">${t}</h3><p class="mut">${p}</p></div>`,
    )
    .join("")}</div></section>
<section class="sec" id="caixa"><div class="c" style="max-width:720px;margin:0 auto 32px"><div class="kick">A caixa</div><h2 style="font-size:2rem;margin:8px 0">Cada remédio no seu lugar. Fácil de achar, até sem enxergar bem.</h2><p class="mut">Cor com padrão, número e Braille: você escolhe o compartimento certo mesmo com daltonismo, baixa visão ou sem enxergar.</p></div><div class="grid4">${[
    [
      "Alarmes que não falham",
      "O horário fica salvo na caixa e no celular. O alarme toca mesmo sem internet.",
    ],
    [
      "Acessível de verdade",
      "Leitor de tela, voz e alto contraste. Na caixa, cada compartimento tem cor com padrão, número e Braille.",
    ],
    [
      "Estoque sem surpresa",
      "Saiba quanto resta e seja avisado antes de acabar. A baixa só ocorre quando você confirma.",
    ],
    [
      "Família e médicos por perto",
      "Compartilhe o painel com quem escolher, módulo por módulo, e revogue quando quiser.",
    ],
  ]
    .map(
      ([t, p]) =>
        `<div class="card"><h3 style="margin-bottom:6px">${t}</h3><p class="mut sm">${p}</p></div>`,
    )
    .join("")}</div></section>
<section class="sec alt"><div class="grid2" style="align-items:center;gap:48px"><div class="box3" aria-hidden="true">${[1, 2, 3, 4, 5, 6].map((n) => `<div class="t">${badge(n, 56)}</div>`).join("")}</div><div><div class="kick">Leve a caixa para casa</div><h2 style="font-size:2rem;margin:8px 0">Faça seu pedido da Caixa CronoMed.</h2><p class="mut">Caixa com seis compartimentos, cabo USB-C, cartão de referência e guia rápido. O aplicativo e o painel web já estão incluídos.</p><div class="row wrap" style="margin:16px 0;align-items:baseline"><span style="font-size:2.4rem;font-weight:700;color:var(--p)">${brl(PRICE)}</span><span class="mut sm">ou 6x de ${brl(PRICE / 6)} sem juros · valores ilustrativos</span></div><a class="btn" href="#/pedido/produto">Faça seu pedido</a></div></div></section>
<section class="sec dark"><div class="c" style="max-width:720px;margin:0 auto 28px"><div class="kick">Por que isso importa</div><h2 style="font-size:2rem;margin-top:8px">O Brasil está envelhecendo. O cuidado em casa precisa acompanhar.</h2></div><div class="grid4">${[
    ["15,6%", "da população brasileira tem 60 anos ou mais (IBGE, 2023)."],
    ["20,5%", "é a projeção para 2033."],
    [
      "3,7×",
      "mais chance de não seguir o tratamento entre idosos que moram sozinhos.",
    ],
    [
      "17%",
      "da população de Praia Grande é idosa, cerca de 65 mil pessoas (2025).",
    ],
  ]
    .map(
      ([n, t]) =>
        `<div class="card" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2)"><div style="font-size:2.4rem;font-weight:800">${n}</div><p style="opacity:.85" class="sm">${t}</p></div>`,
    )
    .join("")}</div></section>
<section class="sec" id="faq"><div class="c" style="margin-bottom:28px"><div class="kick">Dúvidas frequentes</div><h2 style="font-size:2rem;margin-top:8px">Respostas diretas para decidir com segurança.</h2></div><div class="grid2">${[
    [
      "E se a internet ou a energia cair?",
      "Os horários ficam salvos na caixa e no celular, então o alarme continua tocando sem internet. A caixa funciona na tomada ou na bateria (cerca de 12 horas) e avisa quando ela chega a 20%.",
    ],
    [
      "Quem pode ver os meus dados?",
      "Só quem você convidar. Você escolhe, módulo por módulo, se a pessoa só visualiza ou também gerencia, e pode retirar o acesso quando quiser. Tudo segue a LGPD.",
    ],
    [
      "A caixa sabe que eu tomei o remédio?",
      "Ela sabe que o compartimento foi aberto. Para registrar a dose e baixar o estoque, você confirma no app, por toque ou voz.",
    ],
    [
      "Posso usar antes de a caixa chegar?",
      "Sim. O modo digital já traz lembretes no celular, confirmação, estoque e compartilhamento. Luz, som e sensor começam depois que você configurar a caixa.",
    ],
  ]
    .map(
      ([q, a]) =>
        `<div class="card"><h3 style="margin-bottom:6px">${q}</h3><p class="mut sm">${a}</p></div>`,
    )
    .join("")}</div></section>
<section class="sec alt"><div class="card" style="max-width:560px;margin:auto"><h2 style="margin-bottom:14px">Fale com a equipe</h2><form class="col" data-form="contato" novalidate>${field("Nome", "nome")}${field("E-mail", "email", { type: "email" })}<div class="fld"><label class="lab" for="f_msg">Mensagem</label><textarea class="in" id="f_msg" name="msg"></textarea><div class="err" data-err="msg"></div></div><button class="btn">Enviar mensagem</button></form></div></section>${pubFoot()}`;
/* ---------- loja ---------- */
V.produto = () => {
  const q = S.cart ? S.cart.qty : 1;
  return shopShell(
    `<div class="grid2" style="gap:40px;align-items:start"><div class="card" style="background:#EEF3F8"><div class="box3" style="box-shadow:none;background:transparent" role="img" aria-label="Seis compartimentos da caixa">${[1, 2, 3, 4, 5, 6].map((n) => `<div class="t ${n === 1 ? "lit" : ""}">${badge(n, 60)}</div>`).join("")}</div></div><div><div class="mut xs">Início · Pedido</div><h1 style="margin:6px 0">Caixa CronoMed</h1><p class="mut">Caixa inteligente de medicamentos com 6 compartimentos</p><div style="font-size:2.2rem;font-weight:700;color:var(--p);margin:14px 0 2px">${brl(PRICE)}</div><div class="mut sm">ou 6x de ${brl(PRICE / 6)} sem juros · valores ilustrativos</div><ul class="col sm" style="list-style:none;padding:0;margin:18px 0;gap:8px">${["Seis compartimentos com cor, padrão, número e Braille", "Alarme sonoro e LED na cor do compartimento, mesmo sem internet", "Bateria recarregável: até 12 horas sem energia elétrica", "Aplicativo Android e painel web incluídos", "Compartilhamento com família, cuidadores e médicos"].map((t) => `<li class="row" style="gap:10px;align-items:flex-start;color:var(--p)">${ic("check")}<span style="color:var(--ink)">${t}</span></li>`).join("")}</ul><div class="card sm" style="padding:12px 14px;margin-bottom:16px"><b>Na caixa:</b> Caixa CronoMed, cabo USB-C, cartão de referência e guia rápido.</div><div class="row wrap" style="margin-bottom:8px"><div class="row in" style="width:132px;justify-content:space-between" role="group" aria-label="Quantidade"><button data-act="qty" data-d="-1" aria-label="Diminuir">−</button><b>${q}</b><button data-act="qty" data-d="1" aria-label="Aumentar">+</button></div><div class="grow"><input class="in" id="cep" placeholder="Calcular frete: digite o CEP" data-mask="cep" aria-label="CEP"></div><button class="btn2" data-act="cep">Calcular</button></div><div class="mut sm" id="cepmsg" style="min-height:20px">${U.cepMsg || ""}</div><div class="row wrap" style="margin-top:12px"><button class="btn2 grow" data-act="addCart">Adicionar ao carrinho</button><button class="btn grow" data-act="buyNow">Comprar agora</button></div></div></div>`,
  );
};
V.carrinho = () =>
  shopShell(
    !S.cart
      ? `<div class="card c" style="padding:48px"><div style="color:var(--mut)">${ic("cart", 36)}</div><h2 style="margin:10px 0">Seu carrinho está vazio</h2><a class="btn" href="#/pedido/produto">Ver a Caixa CronoMed</a></div>`
      : `<h1 style="margin-bottom:18px">Carrinho</h1><div class="cols"><div class="card"><div class="row wrap"><div class="grow"><div class="b" style="font-size:1.1rem">Caixa CronoMed</div><div class="mut sm">Caixa com 6 compartimentos, cabo USB-C, cartão de referência e guia rápido</div><button class="sm" style="color:var(--bad);font-weight:700;margin-top:8px" data-act="rmCart">Remover</button></div><div class="row in" style="width:120px;justify-content:space-between"><button data-act="qty" data-d="-1" aria-label="Diminuir">−</button><b>${S.cart.qty}</b><button data-act="qty" data-d="1" aria-label="Aumentar">+</button></div><b style="font-size:1.1rem;width:110px;text-align:right">${brl(S.cart.qty * PRICE)}</b></div><div class="row" style="border-top:1px solid var(--bd);margin-top:16px;padding-top:16px"><input class="in" placeholder="Cupom de desconto" aria-label="Cupom"><button class="btn2" data-act="cupom">Aplicar</button></div></div><div>${summary(`<a class="btn block" style="margin-top:16px" href="#/pedido/identificacao">Finalizar pedido</a>`)}</div></div>`,
  );
V.pedIdent = () => {
  if (!S.cart)
    return shopShell(
      `<div class="card c">Seu carrinho está vazio. <a class="b" style="color:var(--p)" href="#/pedido/produto">Ver a caixa</a></div>`,
    );
  const u = me();
  return shopShell(
    `<div class="cols"><div class="card"><h2 style="margin-bottom:14px">Identificação</h2>${
      u
        ? `<div class="banner info">${ic("check", 20)}<div class="grow">Você está identificado como <b>${esc(u.nome)}</b> (${esc(u.email)}).</div></div><a class="btn" style="margin-top:18px" href="#/pedido/entrega">Continuar para a entrega</a>`
        : `${seg(
            [
              ["novo", "Quero criar conta"],
              ["conta", "Já tenho conta"],
            ],
            U.idTab || "novo",
            "idtab",
          )}<form class="col" style="margin-top:18px" data-form="${(U.idTab || "novo") === "novo" ? "ckCadastro" : "ckLogin"}" novalidate>${(U.idTab || "novo") === "novo" ? `${field("Nome completo", "nome", { ac: "name" })}<div class="grid2">${field("CPF", "cpf", { m: "cpf" })}${field("E-mail principal", "email", { type: "email", ac: "email" })}</div><div class="grid2">${pwf("Senha", "senha", true)}${pwf("Confirmar senha", "senha2")}</div>${checklist()}<label class="row sm"><input type="checkbox" name="termos" style="accent-color:var(--p);width:18px;height:18px"> Li e aceito os termos de uso e a política de privacidade (LGPD).</label><div class="err" data-err="termos"></div><button class="btn">Criar conta e continuar</button><p class="mut xs">Enviaremos um e-mail para ativar sua conta. O pedido segue sem esperar a ativação.</p>` : `${field("E-mail ou CPF", "id")}${pwf("Senha", "senha")}<button class="btn">Entrar e continuar</button>`}</form>`
    }</div>${summary()}</div>`,
    1,
  );
};
V.pedEntrega = () => {
  const a = S.ck.addr || {};
  return shopShell(
    `<form class="cols" data-form="entrega" novalidate><div class="card col"><h2>Endereço de entrega</h2>${field("Destinatário", "dest", { v: a.dest || (me() || {}).nome })}<div class="grid2">${field("CEP", "cep", { m: "cep", v: a.cep })}${field("Número", "num", { v: a.num })}</div>${field("Rua", "rua", { v: a.rua })}<div class="grid2">${field("Complemento", "comp", { v: a.comp })}${field("Bairro", "bairro", { v: a.bairro })}</div><div class="grid2">${field("Cidade", "cidade", { v: a.cidade })}${field("UF", "uf", { v: a.uf })}</div><h3>Forma de envio</h3>${Object.entries(
      SHIP,
    )
      .map(
        ([k, [n, p, v]]) =>
          `<label class="opt ${(S.ck.ship || "padrao") === k ? "on" : ""}"><input type="radio" name="ship" value="${k}" ${(S.ck.ship || "padrao") === k ? "checked" : ""} data-act="ship"><span class="grow"><b>${n}</b> · ${p}</span><b>${brl(v)}</b></label>`,
      )
      .join(
        "",
      )}<button class="btn">Continuar para o pagamento</button></div>${summary()}</form>`,
    2,
  );
};
V.pedPag = () => {
  const st = U.pay,
    m = (S.ck.pay || {}).m || "pix";
  const body =
    st === 1
      ? `<h2>Pagamento</h2><div class="mut sm">Passo 1 de 4: escolha a forma</div>${seg(
          [
            ["pix", "Pix"],
            ["cartao", "Cartão de crédito"],
            ["boleto", "Boleto"],
          ],
          m,
          "paym",
        )}${m === "cartao" ? `<form class="col" data-form="payForma" novalidate>${field("Número do cartão", "cartao", { m: "card", ph: "0000 0000 0000 0000" })}${field("Nome impresso no cartão", "nomec")}<div class="grid2">${field("Validade", "val", { ph: "MM/AAAA" })}${field("Código de segurança", "cvv", { ph: "123" })}</div><div class="fld"><label class="lab" for="f_parc">Parcelas</label><select class="in" id="f_parc" name="parc">${[1, 2, 3, 6].map((n) => `<option value="${n}">${n}x de ${brl(orderTotal() / n)} sem juros</option>`).join("")}</select></div><button class="btn">Conferir dados</button></form>` : `<form class="col" data-form="payForma" novalidate><p class="mut">${m === "pix" ? "Você receberá um código Pix simulado na próxima etapa." : "Você receberá um boleto simulado na próxima etapa."}</p><button class="btn">Conferir dados</button></form>`}`
      : st === 2
        ? `<h2>Conferência</h2><div class="mut sm">Passo 2 de 4</div><div class="banner info">${ic("alert", 20)}<b>Pagamento simulado: nenhum valor será cobrado.</b></div><div class="card sm">Forma: <b>${{ pix: "Pix", cartao: "Cartão de crédito", boleto: "Boleto" }[m]}</b><br>Total: <b>${brl(orderTotal())}</b><br>Entrega: ${esc((S.ck.addr || {}).rua || "")}, ${esc((S.ck.addr || {}).num || "")}</div><fieldset class="col" style="border:0;padding:0"><legend class="lab">Resultado da simulação</legend><label class="opt on"><input type="radio" name="res" value="ok" checked data-act="simres"> Aprovado</label><label class="opt"><input type="radio" name="res" value="no" data-act="simres"> Recusado</label></fieldset><div class="row"><button class="btn2" data-act="payBack">Voltar</button><button class="btn grow" data-act="payGo">Finalizar pedido</button></div>`
        : st === 3
          ? `<h2>Processando</h2><div class="mut sm">Passo 3 de 4: processamento simulado</div><div class="spin" role="progressbar" aria-label="Processando"></div><p class="c mut">Aguarde um instante…</p>`
          : U.payRes === "no"
            ? `<h2>Pagamento recusado</h2><div class="banner bad">${ic("alert", 20)}<span>Simulação: o pagamento foi recusado. Nada foi cobrado. Tente outra forma de pagamento.</span></div><button class="btn" data-act="payRetry">Tentar de novo</button>`
            : `<h2>Pagamento aprovado</h2><div class="mut sm">Passo 4 de 4</div><div class="banner info">${ic("check", 20)}<span>Pagamento simulado aprovado.</span></div><a class="btn" href="#/pedido/confirmado">Ver pedido confirmado</a>`;
  return shopShell(
    `<div class="cols"><div class="card col">${S.cart || st >= 4 ? body : "Seu carrinho está vazio."}</div>${summary()}</div>`,
    3,
  );
};
V.pedOk = () => {
  const o = S.orders[0];
  if (!o) return shopShell('<div class="card">Nenhum pedido ainda.</div>');
  const u = me();
  return shopShell(
    `<div style="max-width:760px;margin:auto" class="c col"><div class="avatar" style="width:72px;height:72px;margin:auto;background:var(--p);color:#fff">${ic("check", 38)}</div><h1>Pedido confirmado!</h1><p class="mut">Pedido nº <b>${o.id}</b>. Enviamos o comprovante para ${esc(u ? u.email : "seu e-mail")}.</p><div class="card grid3 sm" style="text-align:left"><div><div class="mut xs">Item</div><b>${o.qty} × Caixa CronoMed</b><div class="mut">Total ${brl(o.total)}</div></div><div><div class="mut xs">Entrega em</div><b>${esc(o.addr.rua || "")}, ${esc(o.addr.num || "")}</b><div class="mut">${esc(o.addr.cidade || "")}, ${esc(o.addr.uf || "")} · ${SHIP[o.ship][1]}</div></div><div><div class="mut xs">Pagamento (simulado)</div><b>${{ pix: "Pix", cartao: "Cartão de crédito", boleto: "Boleto" }[o.pay.m]}</b></div></div><div class="card sm" style="text-align:left"><b>Próximos passos</b><ol style="margin:8px 0 0;padding-left:20px"><li>Ative sua conta pelo link que enviamos ao seu e-mail${u && u.ativo ? " (já ativa)" : ""}.</li><li>Acompanhe o pedido em Meus pedidos.</li><li>Ao ativar a conta, você é levado direto à configuração da caixa.</li></ol></div><div class="row wrap" style="justify-content:center"><a class="btn" href="#/${u && u.ativo ? "app/pedidos/" + o.id : "emails"}">${u && u.ativo ? "Acompanhar pedido" : "Abrir e-mail de ativação"}</a><a class="btn2" href="#/">Voltar ao início</a></div></div>`,
    4,
  );
};
/* ---------- autenticação ---------- */
V.entrar = () =>
  authShell(
    `<h1 style="margin-bottom:20px">Acessar</h1>${seg(
      [
        ["email", "E-mail"],
        ["cpf", "CPF"],
      ],
      U.lt || "email",
      "lt",
    )}<form class="col" style="margin-top:18px" data-form="login" novalidate>${(U.lt || "email") === "email" ? field("E-mail", "id", { type: "email", ac: "username" }) : field("CPF", "id", { m: "cpf" })}${pwf("Senha", "senha")}<div class="err" data-err="geral"></div><div style="text-align:right"><a class="b sm" style="color:var(--p)" href="#/esqueci">Esqueci minha senha</a></div><button class="btn block">Acessar</button></form><p class="c mut" style="margin:20px 0 10px">Seu primeiro acesso aqui?</p><a class="btn2 block" href="#/cadastro">Cadastre-se</a>`,
  );
V.cadastro = () =>
  authShell(
    `<a class="row b sm" style="color:var(--p)" href="#/entrar">${ic("back", 20)}Voltar</a><h1 style="margin:16px 0">Cadastre-se</h1><form class="col" data-form="cadastro" novalidate>${field("Nome completo", "nome", { ac: "name" })}${field("CPF", "cpf", { m: "cpf" })}${field("E-mail principal", "email", { type: "email", ac: "email" })}<div class="sm mut">Crie uma senha com no mínimo:</div>${checklist()}${pwf("Senha", "senha", true)}${pwf("Confirmar senha", "senha2")}<button class="btn block">Cadastrar</button></form>`,
  );
V.verifique = () => {
  const u =
    S.users.find((x) => x.id === U.pending) || S.users[S.users.length - 1];
  return authShell(
    `<div class="c col" style="align-items:center"><div class="avatar" style="width:64px;height:64px;background:var(--tint)">${ic("bell", 30)}</div><h1>Confirme seu e-mail</h1><p class="mut">Enviamos um link de ativação para <b>${esc(u ? u.email : "seu e-mail")}</b>. Ele vale por 60 minutos e só pode ser usado uma vez.</p><a class="btn block" href="#/emails">Abrir e-mail</a><button class="btn2 block" data-act="resend" id="resend" ${U.cd > 0 ? "disabled" : ""}>${U.cd > 0 ? "Reenviar e-mail em " + U.cd + " s" : "Reenviar e-mail"}</button><a class="b sm" style="color:var(--p)" href="#/entrar">Voltar ao login</a></div>`,
  );
};
V.esqueci = () =>
  authShell(
    `<a class="row b sm" style="color:var(--p)" href="#/entrar">${ic("back", 20)}Voltar</a><h1 style="margin:16px 0 8px">Esqueci minha senha</h1><p class="mut" style="margin-bottom:18px">Digite seu e-mail ou CPF para receber o link de redefinição. O link vale por 60 minutos.</p><form class="col" data-form="esqueci" novalidate>${field("E-mail ou CPF", "id")}<button class="btn block">Resetar senha</button></form>`,
  );
V.enviado = () =>
  authShell(
    `<div class="c col" style="align-items:center"><div class="avatar" style="width:64px;height:64px;background:var(--tint)">${ic("bell", 30)}</div><h1>E-mail enviado</h1><p class="mut">Se o endereço estiver cadastrado, você receberá o link para criar uma nova senha. O link é válido por 60 minutos e só pode ser usado uma vez.</p><a class="btn block" href="#/emails">Abrir e-mail</a><button class="btn2 block" data-act="resendReset" ${U.cd > 0 ? "disabled" : ""}>${U.cd > 0 ? "Reenviar em " + U.cd + " s" : "Reenviar e-mail"}</button><a class="b sm" style="color:var(--p)" href="#/entrar">Voltar ao login</a></div>`,
  );
V.novaSenha = (t) =>
  !S.tokens[t]
    ? authShell(
        `<div class="c col" style="align-items:center"><h1>Link inválido ou já usado</h1><p class="mut">Peça um novo link de redefinição.</p><a class="btn" href="#/esqueci">Pedir novo link</a></div>`,
      )
    : authShell(
        `<h1 style="margin-bottom:8px">Nova senha</h1><p class="mut" style="margin-bottom:12px">Sua nova senha deve ser diferente das anteriores e ter no mínimo:</p><form class="col" data-form="novaSenha" data-t="${t}" novalidate>${checklist()}${pwf("Senha", "senha", true)}${pwf("Confirmar senha", "senha2")}<button class="btn block">Cadastrar nova senha</button></form>`,
      );
V.senhaOk = () =>
  authShell(
    `<div class="c col" style="align-items:center"><div class="avatar" style="width:72px;height:72px;background:var(--p);color:#fff">${ic("check", 36)}</div><h1>Senha alterada!</h1><p class="mut">Suas sessões foram encerradas. Entre com a nova senha.</p><a class="btn block" href="#/entrar">Entrar</a></div>`,
  );
/* ---------- caixa de e-mails simulada ---------- */
const MT = {
  ativacao: [
    "Ative sua conta no CronoMed",
    "Recebemos o seu cadastro. Falta só um passo: confirme seu e-mail para ativar a conta. O link vale por 60 minutos e só pode ser usado uma vez.",
    "Ativar minha conta",
  ],
  redefinicao: [
    "Redefinição de senha do CronoMed",
    "Recebemos um pedido para redefinir a senha da sua conta. Clique no botão para criar uma nova senha. O link vale por 60 minutos e só pode ser usado uma vez. Por segurança, nunca pedimos sua senha por e-mail.",
    "Criar nova senha",
  ],
  convite: [
    "Você foi convidado para acompanhar um tratamento",
    "Você foi convidado(a) para acompanhar e compartilhar os dados de um tratamento no CronoMed. Você verá apenas os módulos que o Titular liberar, e ele pode ajustar ou revogar seu acesso quando quiser.",
    "Aceitar convite e criar meu cadastro",
  ],
  pedido: [
    "Recebemos o seu pedido",
    "Seu pedido foi recebido e o pagamento simulado foi aprovado. Estamos preparando a sua Caixa CronoMed.",
    "Acompanhar pedido",
  ],
  enviado: [
    "Seu pedido saiu para entrega",
    "O pedido foi enviado. Código de rastreio de exemplo: BR000000000BR. Quando a caixa chegar, abra o CronoMed e toque em Configurar Dispositivo.",
    "Acompanhar pedido",
  ],
};
V.emails = () => {
  const sel = S.emails.find((e) => e.id === U.mail) || S.emails[0];
  const u = S.users[0];
  const body = sel
    ? (() => {
        const [s, p, cta] = MT[sel.tipo];
        const href =
          sel.tipo === "redefinicao"
            ? `#/nova-senha/${sel.data.token}`
            : sel.tipo === "convite"
              ? `#/convite/${sel.data.share}`
              : `#/app/pedidos/${sel.data.order}`;
        const btn =
          sel.tipo === "ativacao"
            ? `<button class="btn" data-act="activate" data-id="${sel.id}">${cta}</button>`
            : sel.tipo === "redefinicao" || sel.tipo === "convite"
              ? `<a class="btn" href="${href}">${cta}</a>`
              : `<button class="btn" data-act="goOrder" data-o="${esc(sel.data.order)}">${cta}</button>`;
        return `<div class="card" style="padding:0;overflow:hidden"><div class="mut sm" style="padding:16px 24px;line-height:1.7"><b>De:</b> CronoMed &lt;noreply@cronomed.com.br&gt;<br><b>Para:</b> ${esc(sel.to || "")}<br><b>Assunto:</b> ${s}</div><div style="background:var(--p);padding:18px 24px">${logo(30, true)}</div><div class="col" style="padding:24px;gap:14px"><h2>Olá${sel.data.nome ? ", " + esc(sel.data.nome.split(" ")[0]) : ""}!</h2><p>${p}${sel.data.order ? " <b>" + esc(sel.data.order) + "</b>" : ""}</p><div>${btn}</div><p class="mut xs">Você recebeu esta mensagem porque um cadastro, convite ou pedido foi feito com este e-mail. Seus dados são tratados conforme a LGPD.</p></div></div>`;
      })()
    : `<div class="card c mut">A caixa de e-mails simulada está vazia. Cadastre-se, peça a redefinição de senha, convide alguém ou faça um pedido para ver as mensagens.</div>`;
  return `${pubHead()}<main class="shop"><h1 style="margin-bottom:6px">Caixa de e-mails (simulada)</h1><p class="mut" style="margin-bottom:18px">Aqui aparecem os e-mails que o sistema enviaria. Clique no botão da mensagem para seguir o fluxo.</p><div class="cols" style="grid-template-columns:320px 1fr"><div class="col" style="gap:8px">${S.emails.map((e) => `<button class="card row" style="text-align:left;padding:12px 14px;${sel && sel.id === e.id ? "border-color:var(--p);background:var(--tint)" : ""}" data-act="openMail" data-id="${e.id}"><span class="grow"><b class="sm">${MT[e.tipo][0]}</b><div class="mut xs">${esc(e.to || "")} · ${when(e.ts)}</div></span>${e.read ? "" : chip("warn", "novo")}</button>`).join("") || '<div class="mut sm">Nenhuma mensagem.</div>'}<button class="btn2 sm" data-act="clearMail">Limpar caixa</button></div><div>${body}</div></div></main>`;
};
/* ---------- convidado ---------- */
V.convite = (id) => {
  const sh = S.shares.find((s) => s.id === id);
  if (!sh || sh.status === "ativo")
    return authShell(
      `<div class="c col" style="align-items:center"><h1>Convite indisponível</h1><p class="mut">O convite não existe ou já foi aceito.</p><a class="btn" href="#/entrar">Ir para o login</a></div>`,
    );
  const st = U.cs || 1,
    d = U.cd2 || {};
  const tp = d.tipo || "";
  const bar = `<div class="row" style="gap:6px">${[1, 2, 3].map((i) => `<i style="flex:1;height:6px;border-radius:4px;background:${i <= st ? "var(--p)" : "var(--bd)"}"></i>`).join("")}</div><div class="mut xs" style="margin:8px 0 16px">Etapa ${st} de 3 · ${["Dados pessoais", "Dados de contato", "Dados de acesso"][st - 1]}</div>`;
  const lock = `<div class="banner info">${ic("lock", 20)}<span><b>Convite de ${esc(titular().nome.split(" ")[0])}.</b> Campos com cadeado já vieram preenchidos.</span></div>`;
  const s1 = `${lock}${field("Nome completo", "nome", { v: sh.nome, ro: true })}${field("CPF", "cpf", { m: "cpf", v: d.cpf })}<fieldset class="col" style="border:0;padding:0;gap:8px"><legend class="lab">Tipo de convidado</legend>${Object.entries(
    TIPOS,
  )
    .map(
      ([k, t]) =>
        `<label class="opt ${tp === k ? "on" : ""}"><input type="radio" name="tipo" value="${k}" ${tp === k ? "checked" : ""} data-act="tipo">${t}</label>`,
    )
    .join(
      "",
    )}<div class="err" data-err="tipo"></div></fieldset>${tp === "enfermeiro" ? field("COREN (obrigatório)", "coren", { v: d.coren }) : ""}${tp === "medico" ? field("CRM (obrigatório)", "crm", { v: d.crm }) + field("Especialidade médica (obrigatória)", "esp", { v: d.esp }) : ""}<button class="btn block">Dados de contato →</button>`;
  const s2 = `${lock}${field("Telefone principal", "tel", { v: d.tel || sh.whats || "", ro: !!sh.whats })}${field("Telefone opcional", "tel2", { v: d.tel2, ph: "Opcional" })}${field("WhatsApp", "whats", { v: sh.whats || "", ro: true })}${field("E-mail", "email", { v: sh.email || "", ro: true })}<div class="row"><button type="button" class="btn2" data-act="csBack">Voltar</button><button class="btn grow">Dados de acesso →</button></div>`;
  const s3 = `<div class="sm mut">Crie uma senha com no mínimo:</div>${checklist()}${pwf("Senha", "senha", true)}${pwf("Confirmar senha", "senha2")}<div class="row"><button type="button" class="btn2" data-act="csBack">Voltar</button><button class="btn grow">Finalizar cadastro</button></div>`;
  return authShell(
    `<h1 style="margin-bottom:14px">Cadastre-se</h1>${bar}<form class="col" data-form="convite${st}" data-id="${id}" novalidate>${[s1, s2, s3][st - 1]}</form>`,
  );
};
V.conviteOk = () => {
  const u = me(),
    sh = shareOf(u);
  if (!sh) return authShell("<p>Nada a mostrar.</p>");
  const first = NAV.find((n) => can(n[0]));
  return authShell(
    `<div class="col"><div class="avatar" style="width:72px;height:72px;background:var(--p);color:#fff">${ic("check", 36)}</div><h1>Cadastro concluído!</h1><p class="mut">Você agora acompanha o tratamento de <b>${esc(titular().nome)}</b> como ${TIPOS[u.role]}. O acesso é limitado ao que ele autorizou.</p><div class="card" style="padding:8px 16px"><div class="b sm" style="padding:10px 0">Telas liberadas para você</div>${MODS.map(([k, t]) => `<div class="row sp" style="padding:9px 0;border-top:1px solid var(--bd)"><span class="row">${ic("check", 18)}${t}</span>${chip("ok", sh.perms[k] === "G" ? "Gerenciamento" : "Visualização")}</div>`).join("")}</div><a class="btn block" href="#/app/${first ? first[0] : "doses"}">Acessar ${first ? first[1] : "o painel"}</a><p class="mut xs">Dados compartilhados com seu consentimento. O Titular pode revogar o acesso a qualquer momento (LGPD).</p></div>`,
  );
};
/* ---------- configurar caixa (Bluetooth) ---------- */
V.caixa = () => {
  const st = U.bt,
    steps = ["Bluetooth", "Localizar", "Ativar", "Sincronizar", "Pronto"];
  const b = S.sim;
  const body =
    st === 1
      ? `<h2>Ativar o Bluetooth</h2><p class="mut">Ligue a caixa e deixe o celular perto dela. O CronoMed usa o Bluetooth só para encontrar e configurar a caixa.</p>${b.bt ? "" : `<div class="banner bad">${ic("alert", 20)}<span>Bluetooth desligado ou permissão negada. Ative-o e tente de novo.</span></div>`}<button class="btn" data-act="btOn">${ic("bt", 18)} Ativar Bluetooth</button>`
      : st === 2
        ? U.scan
          ? `<h2>Procurando a caixa…</h2><div class="spin" role="progressbar" aria-label="Procurando"></div><p class="c mut">Mantenha a caixa ligada e por perto.</p>`
          : b.near
            ? `<h2>Caixa encontrada</h2><div class="card row" style="border:2px solid var(--p);background:var(--okb)">${logoMark(36)}<div class="grow"><b>Caixa CronoMed · A3F9</b><div class="mut xs">Sinal forte · A4:CF:12:9B:3F:A9</div></div>${ic("check", 22)}</div><button class="btn" data-act="btFound">Continuar</button>`
            : `<h2>Caixa não encontrada</h2><div class="banner warn">${ic("alert", 20)}<span>Ligue a caixa e aproxime o celular. Se preferir, configure depois e use o modo digital.</span></div><button class="btn" data-act="btOn">Procurar de novo</button>`
        : st === 3
          ? `<h2>Ativar a caixa</h2><p class="mut">A caixa vai confirmar o pareamento por Bluetooth, com canal criptografado.</p><button class="btn" data-act="btPair" ${U.pairing ? "disabled" : ""}>${U.pairing ? "Ativando…" : "Ativar caixa"}</button>`
          : st === 4
            ? `<h2>Sincronizar ao CronoMed</h2><form class="col" data-form="sync" novalidate>${field("Nome da caixa", "nome", { v: "Caixa da sala" })}${field("Rede Wi-Fi", "wifi", { v: "Casa_" + titular().nome.split(" ").pop() })}${pwf("Senha da rede", "wsenha")}<div class="banner info">${ic("lock", 20)}<span>As credenciais seguem criptografadas direto para a caixa e não ficam no aplicativo. A caixa também recebe o plano de horários.</span></div><button class="btn">Sincronizar</button></form>`
            : `<div class="c col" style="align-items:center"><div class="avatar" style="width:72px;height:72px;background:var(--p);color:#fff">${ic("check", 36)}</div><h2>Caixa configurada!</h2><p class="mut">A senha da caixa aparece só agora: <b>${esc(U.boxPw || "")}</b>. Anote-a.</p><a class="btn" href="#/app/${Object.keys(S.meds).length ? "doses" : "medicamentos"}">${Object.keys(S.meds).length ? "Ir para Próximas Doses" : "Cadastrar o primeiro medicamento"}</a></div>`;
  return `<div class="auth" style="grid-template-columns:1fr"><div class="form" style="min-height:100vh"><main style="max-width:560px"><div class="row sp" style="margin-bottom:18px">${logo()}${S.session ? '<button class="btn2 sm" data-act="later">Configurar depois</button>' : ""}</div><div class="row" style="gap:6px">${steps.map((t, i) => `<i style="flex:1;height:6px;border-radius:4px;background:${i < st ? "var(--p)" : "var(--bd)"}"></i>`).join("")}</div><div class="mut xs" style="margin:8px 0 18px">Etapa ${st} de 5 · ${steps[st - 1]}</div><div class="col card">${body}</div>${S.sim.bt && st < 5 ? "" : ""}</main></div></div>`;
};
/* ---------- portal ---------- */
V.doses = () => {
  const u = me(),
    ds = dosesToday(),
    first = !Object.keys(S.meds).length,
    ad = adherence(),
    low = lowMeds();
  const hello = first
    ? `<div><div class="mut sm">Primeiro acesso | Faça os primeiros ajustes</div><h2 style="font-size:1.5rem">Seja bem-vindo, ${esc(u.nome.split(" ")[0])}!</h2></div>`
    : `<h2 style="font-size:1.3rem">Olá, ${esc(u.nome.split(" ")[0])}! Confira os horários das próximas medicações.</h2>`;
  return portal(
    "doses",
    "Próximas Doses",
    new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    `${hello}${digitalBanner()}${low
      .slice(0, 2)
      .map(
        (m) =>
          `<div class="banner warn">${ic("alert", 20)}<span class="grow"><b>Confira o estoque de ${esc(m.name)}</b>, que ${stk(m)[1] === "Esgotado" ? "acabou" : "acabará em " + daysLeft(m) + " dia(s)"}!</span><a class="b" style="color:var(--p)" href="#/app/estoque">Ver estoque</a></div>`,
      )
      .join("")}
<h3>Próximas doses</h3>${
      ds.length
        ? `<div class="grid3">${ds
            .map((d) => {
              const [k, t] = dState(d),
                pend =
                  !["ok", "bad"].includes(k) &&
                  t !== "Sem confirmação" &&
                  toMin(d.time) <= toMin(hm(now())) &&
                  can("doses", "G");
              return `<div class="card dose ${pend ? "click" : ""}" ${pend ? `data-act="confirmOpen" data-id="${d.id}" tabindex="0" role="button"` : ""}>${badge(d.slot, 44)}<div class="grow"><b>${esc(d.med.name)} ${esc(d.med.dose)}</b><div class="mut xs">${d.med.qty} ${esc(d.med.unit)} · Compartimento ${d.slot}</div>${chip(k, t, k === "ok" ? "check" : null)}</div><div class="time">${d.time}</div></div>`;
            })
            .join("")}</div>`
        : `<div class="card row sp wrap"><span class="mut">Sem doses cadastradas no momento.</span>${can("medicamentos", "G") ? '<a class="btn sm" href="#/app/medicamentos">+ Cadastrar Medicamento</a>' : ""}</div>`
    }
<div class="grid2"><div class="card"><div class="mut sm">Adesão ao tratamento</div><div class="row" style="align-items:baseline"><b style="font-size:2rem;color:var(--p)">${ad == null ? "0" : ad}%</b><span class="mut sm">${ad == null ? "não houve cadastro de medicamentos." : "das doses registradas"}</span></div><div class="bar"><i style="width:${ad || 0}%"></i></div></div><div class="card"><div class="row sp"><b>Caixa CronoMed</b>${chip(S.box ? "ok" : "warn", S.box ? (S.online ? "online" : "offline") : "não configurada")}</div>${S.box ? `<div class="row sm" style="margin-top:12px">${ic("bat")}Bateria 78%</div><div class="mut xs" style="margin-top:6px">${esc(S.box.nome)} · ${S.queue.length ? S.queue.length + " registro(s) aguardando sincronização" : "sincronizada"}</div>` : `<div class="mut sm" style="margin-top:10px">Configure a caixa para ligar o alarme físico.</div>${can("dispositivos", "G") ? '<a class="btn sm" style="margin-top:8px" href="#/app/configurar-caixa">+ Configurar Dispositivo</a>' : ""}`}</div></div>`,
  );
};
V.medicamentos = (slot) => {
  if (!can("medicamentos"))
    return portal(
      "medicamentos",
      "Gerenciar Medicamentos",
      "",
      denied("Gerenciar Medicamentos"),
    );
  if (slot) return V.medForm(+slot);
  return portal(
    "medicamentos",
    "Gerenciar Medicamentos",
    "Compartimentos da caixa",
    `${viewOnly("medicamentos")}<div class="banner warn">${ic("alert", 20)}<span><b>Aviso:</b> é fundamental conferir a receita médica e a embalagem física do medicamento para ajustar o sistema de acordo com as orientações do profissional de saúde.</span></div><h3>Selecione um compartimento para continuar.</h3><div class="grid3">${[
      1, 2, 3, 4, 5, 6,
    ]
      .map((n) => {
        const m = S.meds[n];
        return `<button class="card slot" data-go="#/app/medicamentos/${n}" ${can("medicamentos", "G") || m ? "" : "disabled"}><div class="row sp">${badge(n, 44)}<span class="b sm" style="color:var(--p)">${m ? (can("medicamentos", "G") ? "Editar" : "Ver") : "+ Cadastrar"}</span></div>${m ? `<div><b>${esc(m.name)} ${esc(m.dose)}</b><div class="mut sm">${m.times.join(" / ")} · ${m.stock} un.</div></div>` : `<div><b class="mut">Vazio</b><div class="mut sm">--:-- · 0 un.</div></div>`}</button>`;
      })
      .join("")}</div>`,
  );
};
V.medForm = (slot) => {
  const base = S.meds[slot] || {
    name: "",
    dose: "",
    unit: "comprimido",
    qty: 1,
    times: [],
    days: [0, 1, 2, 3, 4, 5, 6],
    stock: "",
    obs: "",
    rep: { on: true, iv: 5 },
  };
  const m = { ...base, ...(U.draftSlot === slot && U.draft ? U.draft : {}) };
  const G = can("medicamentos", "G"),
    ro = G ? "" : "readonly";
  U.times = U.times && U.slot === slot ? U.times : [...base.times];
  U.slot = slot;
  if (!U.times.length && !S.meds[slot]) U.times = ["08:00"];
  const rep = U.rep && U.repSlot === slot ? U.rep : { ...base.rep };
  U.rep = rep;
  U.repSlot = slot;
  U.days = U.daysSlot === slot ? U.days : [...base.days];
  U.daysSlot = slot;
  return portal(
    "medicamentos",
    "Gerenciar Medicamentos",
    `Compartimento ${slot}`,
    `${viewOnly("medicamentos")}<form class="card col" data-form="med" data-slot="${slot}" novalidate><div class="row">${badge(slot, 48)}<b>Armazene no compartimento selecionado.</b></div>${field("Nome do medicamento", "name", { v: m.name, ro: !G })}<div class="grid3">${field("Dosagem", "dose", { v: m.dose, ro: !G, ph: "20mg" })}${field("Unidade por tomada", "qty", { v: m.qty, type: "number", min: 1, ro: !G })}${field("Quantidade na embalagem", "stock", { v: m.stock, type: "number", min: 0, ro: !G })}</div><div class="fld"><span class="lab">Horários</span><div class="col" style="gap:8px" id="times">${U.times.map((t, i) => `<div class="row"><input class="in" type="time" value="${t}" data-act="timeSet" data-i="${i}" aria-label="Horário ${i + 1}" ${ro} style="max-width:160px">${G && U.times.length > 1 ? `<button type="button" class="btn2 sm" data-act="timeDel" data-i="${i}" aria-label="Remover horário ${i + 1}">${ic("x", 16)}</button>` : ""}</div>`).join("")}${G ? `<div><button type="button" class="btn2 sm" data-act="timeAdd">${ic("plus", 16)} Adicionar horário</button></div>` : ""}</div><div class="err" data-err="times"></div></div><div class="fld"><span class="lab">Dias da semana</span><div class="row wrap" style="gap:6px">${DIAS.map((d, i) => `<button type="button" class="chip ${U.days.includes(i) ? "ok" : ""}" style="padding:8px 12px" data-act="dayTgl" data-i="${i}" aria-pressed="${U.days.includes(i)}" ${G ? "" : "disabled"}>${d}</button>`).join("")}</div></div><div class="card" style="background:var(--bg)"><div class="row sp"><div><b>Repetição de alarme</b><div class="mut xs">Repetir se o horário for perdido, até 12 vezes ou até o fim da janela de 1 hora.</div></div>${tgl(rep.on, "repTgl", G ? "" : "disabled")}</div>${rep.on ? `<div class="row wrap" style="margin-top:12px"><span class="sm mut">A cada</span>${[2, 5, 10, 15].map((n) => `<button type="button" class="chip ${rep.iv == n ? "ok" : ""}" style="padding:8px 14px" data-act="repIv" data-v="${n}" aria-pressed="${rep.iv == n}" ${G ? "" : "disabled"}>${n} min</button>`).join("")}</div>` : ""}</div><div class="fld"><label class="lab" for="f_obs">Instruções específicas</label><textarea class="in" id="f_obs" name="obs" ${ro}>${esc(m.obs)}</textarea></div>${G ? `<div class="row wrap" style="justify-content:flex-end"><a class="btn2" href="#/app/medicamentos">Cancelar</a>${S.meds[slot] ? `<button type="button" class="btn2 danger" data-act="medDel" data-slot="${slot}">Excluir</button>` : ""}<button class="btn">${S.meds[slot] ? "Atualizar" : "Cadastrar"}</button></div>` : `<a class="btn2" href="#/app/medicamentos">Voltar</a>`}</form>`,
  );
};
V.estoque = () => {
  if (!can("estoque"))
    return portal("estoque", "Estoque", "", denied("Estoque"));
  const ms = Object.values(S.meds);
  return portal(
    "estoque",
    "Gerenciar Estoque",
    "Quantidade restante e previsão de término",
    `${viewOnly("estoque")}${
      ms.length
        ? ms
            .map((m) => {
              const [k, t, d] = stk(m),
                pct = Math.max(
                  0,
                  Math.min(
                    100,
                    Math.round(
                      (m.stock * 100) / (m.total || Math.max(m.stock, 1)),
                    ),
                  ),
                );
              return `<div class="card row wrap">${badge(m.slot, 40)}<div class="b grow" style="min-width:160px">${esc(m.name)} ${esc(m.dose)}</div><div class="grow" style="min-width:180px"><div class="row sp xs"><span>${m.stock} ${esc(m.unit)}(s)</span><span class="mut">${d >= 999 ? "—" : d + " dia(s)"}</span></div><div class="bar ${k === "ok" ? "" : k}"><i style="width:${pct}%"></i></div></div>${chip(k, t)}${can("estoque", "G") ? `<button class="btn2 sm" data-act="refill" data-slot="${m.slot}">Reabastecer</button>` : ""}</div>`;
            })
            .join("")
        : `<div class="card c mut">Nenhum medicamento cadastrado. <a class="b" style="color:var(--p)" href="#/app/medicamentos">Cadastrar medicamento</a></div>`
    }`,
  );
};
V.historico = () => {
  if (!can("historico"))
    return portal("historico", "Histórico", "", denied("Histórico"));
  const lim = U.hf === "all" ? 1e9 : +U.hf * 86400000,
    h = S.history.filter((x) => Date.now() - x.ts <= lim),
    tom = h.filter((x) => x.res === "Tomada").length,
    per = h.filter((x) => x.res === "Perdida").length;
  return portal(
    "historico",
    "Histórico de Medicação",
    "Aberturas da caixa cruzadas com confirmações no app",
    `${viewOnly("historico")}<div class="grid3"><div class="card"><b style="font-size:2rem;color:var(--p)">${tom}</b><div class="mut sm">Doses tomadas</div></div><div class="card"><b style="font-size:2rem;color:var(--bad)">${per}</b><div class="mut sm">Doses perdidas</div></div><div class="card"><b style="font-size:2rem">${h.length ? Math.round((tom * 100) / h.length) : 0}%</b><div class="mut sm">Adesão no período</div></div></div><div class="row wrap">${seg(
      [
        ["7", "7 dias"],
        ["30", "30 dias"],
        ["all", "Todos"],
      ],
      U.hf,
      "hf",
    )}${can("historico", "G") ? '<button class="btn2 sm" data-act="csv">Exportar CSV</button>' : ""}</div><div class="tbl"><table><thead><tr><th>Data e hora</th><th>Medicamento</th><th>Caixa (sensor)</th><th>App (confirmação)</th><th>Resultado</th></tr></thead><tbody>${h.map((x) => `<tr><td>${x.date.split("-").reverse().slice(0, 2).join("/")} ${x.time}</td><td><span class="row">${badge(x.slot, 26)}${esc(x.name)}</span></td><td>${esc(x.box)}</td><td>${esc(x.app)}</td><td>${chip(x.res === "Tomada" ? "ok" : x.res === "Perdida" ? "bad" : "warn", x.res)}</td></tr>`).join("") || '<tr><td colspan="5" class="mut c">Nenhum registro no período.</td></tr>'}</tbody></table></div><p class="mut xs">O estoque só é baixado quando há confirmação; a abertura da caixa isolada não conta como dose tomada.</p>`,
  );
};
V.compart = () => {
  if (!can("compartilhamento"))
    return portal(
      "compartilhamento",
      "Compartilhamento",
      "",
      denied("Compartilhamento"),
    );
  const G = can("compartilhamento", "G");
  return portal(
    "compartilhamento",
    "Compartilhamento e permissões",
    "Nível de acesso por módulo",
    `${viewOnly("compartilhamento")}<div class="row sp wrap"><b>Pessoas com acesso</b>${G ? `<button class="btn" data-act="invite">${ic("plus", 16)} Convidar</button>` : ""}</div>${
      S.shares.length
        ? S.shares
            .map(
              (s) =>
                `<div class="card col"><div class="row wrap"><span class="avatar">${s.nome
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}</span><div class="grow"><b>${esc(s.nome)}</b><div class="mut xs">${s.tipo ? TIPOS[s.tipo] : "Convite enviado"} · ${esc(s.email || s.whats || "")}</div></div>${chip(s.status === "ativo" ? "ok" : "warn", s.status === "ativo" ? "Ativo" : s.status === "pausado" ? "Pausado" : "Convite pendente")}${G ? `<button class="btn2 sm" data-act="shPause" data-id="${s.id}">${s.status === "pausado" ? "Ativar" : "Pausar"}</button><button class="btn2 sm danger" data-act="shDel" data-id="${s.id}">Excluir</button>` : ""}</div><div class="grid4" style="gap:8px">${MODS.map(([k, t]) => `<label class="sm"><span class="mut xs">${t}</span><select class="in" style="min-height:38px;padding:6px 8px" data-act="perm" data-id="${s.id}" data-m="${k}" ${G ? "" : "disabled"}><option value="V" ${s.perms[k] === "V" ? "selected" : ""}>Visualização</option><option value="G" ${s.perms[k] === "G" ? "selected" : ""}>Gerenciamento</option></select></label>`).join("")}</div></div>`,
            )
            .join("")
        : `<div class="card c mut">Ninguém foi convidado ainda.</div>`
    }<p class="mut xs">Os convidados acompanham o tratamento com acesso apenas ao que você liberar. Mantemos seus dados pessoais e de contato sob sigilo.</p><div class="card"><b>Registro de acessos</b><div class="col sm" style="gap:6px;margin-top:8px">${
      S.audit
        .slice(0, 6)
        .map(
          (a) =>
            `<div><b>${esc(a.by)}</b> ${esc(a.t)} <span class="mut xs">· ${when(a.ts)}</span></div>`,
        )
        .join("") || '<span class="mut">Sem registros.</span>'
    }</div></div>`,
  );
};
V.dispositivos = () => {
  if (!can("dispositivos"))
    return portal("dispositivos", "Dispositivos", "", denied("Dispositivos"));
  const G = can("dispositivos", "G");
  return portal(
    "dispositivos",
    "Dispositivos",
    "Caixas vinculadas à sua conta",
    `${viewOnly("dispositivos")}${S.box ? `<div class="grid2"><div class="card col"><div class="row sp">${logo(30)}${chip(S.online ? "ok" : "warn", S.online ? "Online" : "Offline")}</div><div><b style="font-size:1.1rem">${esc(S.box.nome)}</b><div class="mut sm">Firmware 1.4.2 · A4:CF:12:9B:3F:A9</div></div><div class="grid2"><div class="card" style="background:var(--bg)"><div class="mut xs">Bateria</div><b style="font-size:1.4rem">78%</b><div class="bar"><i style="width:78%"></i></div><div class="mut xs">Alerta crítico em 20%</div></div><div class="card" style="background:var(--bg)"><div class="mut xs">Wi-Fi</div><b>${esc(S.box.wifi)}</b><div class="mut xs">Sincronizada ${when(S.box.sync)}</div></div></div>${G ? `<div class="row wrap"><button class="btn2" data-act="rewifi">${ic("wifi", 16)} Reconfigurar Wi-Fi</button><button class="btn2 danger" data-act="revoke">Revogar dispositivo</button></div>` : ""}</div><div class="card"><b>Compartimentos e sensores</b><div class="grid3" style="margin-top:12px">${[1, 2, 3, 4, 5, 6].map((n) => `<div class="c card" style="padding:12px">${badge(n, 36)}<div class="mut xs" style="margin-top:6px">${U.led === n ? '<span class="led on"></span>Aceso' : "Tampa fechada"}</div></div>`).join("")}</div><p class="mut xs" style="margin-top:12px">Capacidade por caixa: até 2 pacientes e 6 tratamentos ativos.</p></div></div>` : `<div class="card c col" style="align-items:center;padding:40px"><div style="color:var(--mut)">${ic("device", 36)}</div><h2>Você ainda não tem uma caixa configurada</h2><p class="mut">Sem a caixa, o CronoMed funciona só no digital.</p><div class="row wrap">${G ? '<a class="btn" href="#/app/configurar-caixa">Configurar dispositivo</a>' : ""}<a class="btn2" href="#/pedido/produto">Faça seu pedido</a></div></div>`}`,
  );
};
V.config = () => {
  if (!can("configuracoes"))
    return portal(
      "configuracoes",
      "Configurações",
      "",
      denied("Configurações"),
    );
  const G = can("configuracoes", "G"),
    c = S.cfg,
    row = (t, d, r) =>
      `<div class="row sp" style="padding:12px 0;border-top:1px solid var(--bd)"><div><div class="b sm">${t}</div><div class="mut xs">${d}</div></div>${r}</div>`;
  return portal(
    "configuracoes",
    "Configurações",
    "Acessibilidade, alertas e privacidade",
    `${viewOnly("configuracoes")}<div class="grid2"><div class="card"><b>Acessibilidade</b>${row("Alto contraste", "Contraste mínimo de 7:1", tgl(c.contrast, "cfg", `data-k="contrast" ${G ? "" : "disabled"}`))}${row("Tamanho da fonte", "Padrão · Grande · Extra grande", `<div class="seg" style="min-width:150px">${["A", "A+", "A++"].map((t, i) => `<button type="button" class="${c.font === i ? "on" : ""}" data-act="font" data-v="${i}" ${G ? "" : "disabled"}>${t}</button>`).join("")}</div>`)}${row("Narração por voz", "Lê nome, dosagem e horário", tgl(c.narrate, "cfg", `data-k="narrate" ${G ? "" : "disabled"}`))}${row("Comando de voz", "Confirmar doses falando", tgl(c.voice, "cfg", `data-k="voice" ${G ? "" : "disabled"}`))}</div><div class="col"><div class="card"><b>Alertas e estoque</b>${row("Aviso de estoque baixo", "Dias antes do término", `<div class="row"><button class="btn2 sm" data-act="days" data-d="-1" ${G ? "" : "disabled"} aria-label="Menos um dia">−</button><b>${c.days} dias</b><button class="btn2 sm" data-act="days" data-d="1" ${G ? "" : "disabled"} aria-label="Mais um dia">+</button></div>`)}${row("Notificações de dose", "Repetição definida em cada medicamento", chip("ok", "Ativas"))}${row("Bateria da caixa", "Aviso ao chegar em 20%", chip("ok", "Ativo"))}</div>${isT() ? `<div class="card"><b>Privacidade (LGPD)</b>${row("Exportar meus dados", "Histórico e cadastros", '<button class="btn2 sm" data-act="csv">Exportar</button>')}${row("Excluir conta", "Remove todos os dados deste navegador", '<button class="btn2 sm danger" data-act="delAcc">Excluir</button>')}</div>` : ""}</div></div>`,
  );
};
V.alterar = () => {
  const u = me();
  return portal(
    "",
    "Alterar cadastro",
    "Mantenha seus dados atualizados",
    `<form class="card col" data-form="alterar" novalidate>${field("Nome completo", "nome", { v: u.nome })}<div class="grid2">${field("CPF", "cpf", { v: u.cpf, ro: true, hint: "O CPF não pode ser alterado." })}${field("E-mail principal", "email", { v: u.email, type: "email" })}</div><div class="grid2">${field("Telefone principal", "tel", { v: u.tel || "", m: "phone" })}${field("Telefone opcional", "tel2", { v: u.tel2 || "", m: "phone" })}</div><div class="row wrap" style="justify-content:flex-end"><a class="btn2" href="#/app/doses">Cancelar</a><button class="btn">Salvar alterações</button></div></form>`,
  );
};
V.seg = () => {
  const mobile = matchMedia("(max-width:640px)").matches;
  return portal(
    "",
    "Segurança",
    "Proteja o acesso à sua conta",
    `<div class="card col"><b>Alterar senha</b><form class="col" data-form="altSenha" novalidate>${pwf("Senha atual", "atual")}${checklist()}${pwf("Nova senha", "senha", true)}${pwf("Confirmar nova senha", "senha2")}<button class="btn" style="align-self:flex-start">Alterar senha</button></form></div><div class="card row sp" ${mobile ? "" : 'style="opacity:.6"'}><div><b>Autenticação biométrica</b><div class="mut sm">${mobile ? "Entrar com impressão digital ou reconhecimento facial. A senha continua válida como alternativa." : "Disponível apenas no aplicativo móvel (use a tela estreita para ver o seletor)."}</div></div>${tgl(S.bio, "bio", mobile ? "" : "disabled")}</div>`,
  );
};
V.pedidos = () => {
  if (!isT()) return portal("", "Meus pedidos", "", denied("Meus pedidos"));
  return portal(
    "",
    "Meus pedidos",
    "Compras da Caixa CronoMed",
    S.orders.length
      ? `<div class="tbl"><table><thead><tr><th>Pedido</th><th>Data</th><th>Itens</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>${S.orders.map((o) => `<tr><td><b>${o.id}</b></td><td>${when(o.ts[0])}</td><td>${o.qty} × Caixa CronoMed</td><td>${brl(o.total)}</td><td>${chip(o.status >= 4 ? "ok" : "warn", PSTEPS[o.status])}</td><td><a class="b" style="color:var(--p)" href="#/app/pedidos/${o.id}">Acompanhar</a></td></tr>`).join("")}</tbody></table></div><div class="row sp wrap"><span class="mut sm">Precisa de outra caixa? Você pode fazer um novo pedido.</span><a class="btn" href="#/pedido/produto">Fazer novo pedido</a></div>`
      : `<div class="card c col" style="align-items:center"><h2>Você ainda não fez pedidos</h2><a class="btn" href="#/pedido/produto">Faça seu pedido</a></div>`,
  );
};
V.pedido = (id) => {
  const o = S.orders.find((x) => x.id === id);
  if (!o || !isT()) return portal("", "Pedido", "", denied("este pedido"));
  return portal(
    "",
    "Pedido " + o.id,
    "Acompanhe cada etapa até a entrega",
    `<div class="grid2"><div class="card"><div class="row sp" style="margin-bottom:16px"><b>Andamento</b>${chip(o.status >= 4 ? "ok" : "warn", PSTEPS[o.status])}</div><div class="tl">${PSTEPS.map((t, i) => `<div class="s ${i < o.status ? "done" : i === o.status ? "on" : ""}"><div class="d"><i>${i < o.status || (i === o.status && o.status === 4) ? ic("check", 14) : ""}</i>${i < 4 ? "<u></u>" : ""}</div><div><b>${t}</b><div class="mut xs">${o.ts[i] ? when(o.ts[i]) : i === 3 ? "O código de rastreio aparece aqui" : i === 4 ? "Previsão: " + SHIP[o.ship][1] : "Aguardando"}</div></div></div>`).join("")}</div></div><div class="col"><div class="card sm"><b>Resumo</b><div style="margin-top:6px;line-height:1.7">${o.qty} × Caixa CronoMed · ${brl(o.qty * PRICE)}<br>Frete ${SHIP[o.ship][0].toLowerCase()} · ${brl(SHIP[o.ship][2])}<br><b>Total ${brl(o.total)}</b><div class="mut">Entrega: ${esc(o.addr.rua || "")}, ${esc(o.addr.num || "")}, ${esc(o.addr.cidade || "")}, ${esc(o.addr.uf || "")}<br>Pagamento simulado: ${{ pix: "Pix", cartao: "cartão de crédito", boleto: "boleto" }[o.pay.m]}</div></div></div><div class="card" style="background:var(--tint)"><b>Quando a caixa chegar</b><p class="sm" style="margin:6px 0 12px">Abra o CronoMed e toque em <b>Configurar Dispositivo</b>. Leva poucos minutos.</p><a class="btn sm" href="#/app/configurar-caixa">Configurar caixa</a></div></div></div>`,
  );
};
/* ---------- janelas ---------- */
const M = {};
M.confirmar = (id) => {
  const [slot, time] = id.split("@"),
    m = S.meds[slot];
  if (!m) return "";
  const l = lgGet(id) || {};
  return `<h2 id="mt">Você tomou o medicamento?</h2><div class="c col" style="align-items:center;margin:14px 0"><span class="chip warn">${ic("bell", 13)}Lembrete ${(l.rem || 0) + 1} de 13</span>${badge(+slot, 72)}<div class="mut sm">Compartimento ${slot} · ${time}</div><h2>${esc(m.name)} ${esc(m.dose)}</h2><p class="mut sm">${m.qty} ${esc(m.unit)} ${esc(m.obs || "")}</p>${S.box && l.opened ? `<div class="banner info">${ic("device", 20)}<span>Caixa aberta às ${hm(new Date(l.opened))}. Falta a sua confirmação para dar baixa no estoque.</span></div>` : ""}</div><div class="row"><button class="btn2 grow" data-act="confirmNo" data-id="${id}">Ainda não tomei</button><button class="btn grow" data-act="confirmYes" data-id="${id}">Sim, tomei</button></div>${S.cfg.voice ? `<button class="btn2 sm block" style="margin-top:10px" data-act="voice" data-id="${id}">${ic("mic", 16)} Confirmar por voz: diga “sim” ou “não”</button><div class="mut xs c" id="vmsg" style="margin-top:6px"></div>` : ""}<button class="btn2 sm block" style="margin-top:10px" data-act="closeModal">Fechar</button>`;
};
M.refill = (slot) => {
  const m = S.meds[slot];
  return `<h2 id="mt">Reabastecer ${esc(m.name)}</h2><form class="col" style="margin-top:14px" data-form="refill" data-slot="${slot}" novalidate>${field("Quantidade comprada", "q", { type: "number", min: 1 })}<div class="row"><button type="button" class="btn2 grow" data-act="closeModal">Cancelar</button><button class="btn grow">Somar ao estoque</button></div></form>`;
};
M.invite = () =>
  `<h2 id="mt">Convidar pessoa</h2><p class="mut sm" style="margin:6px 0 14px">O convidado receberá um link via WhatsApp e/ou e-mail para criar o cadastro.</p><form class="col" data-form="invite" novalidate>${field("Nome completo *", "nome")}${field("WhatsApp", "whats", { m: "phone", ph: "(13) 99999-9999" })}${field("E-mail", "email", { type: "email" })}<div class="hint">Informe pelo menos um contato: WhatsApp ou e-mail.</div><div class="err" data-err="contato"></div><div class="card" style="padding:12px 14px"><b class="sm">Nível de acesso por módulo</b>${MODS.map(([k, t]) => `<div class="row sp" style="padding:8px 0;border-top:1px solid var(--bd)"><span class="sm">${t}</span><span class="seg" style="min-width:210px"><label style="flex:1"><input type="radio" name="p_${k}" value="V" checked class="hide"><button type="button" class="on" data-act="permPick" data-k="${k}" data-v="V">Visualização</button></label><label style="flex:1"><input type="radio" name="p_${k}" value="G" class="hide"><button type="button" data-act="permPick" data-k="${k}" data-v="G">Gerenciamento</button></label></span></div>`).join("")}</div><div class="row"><button type="button" class="btn2 grow" data-act="closeModal">Cancelar</button><button class="btn grow">Enviar convite</button></div></form>`;
M.ask = (title, text, act, data) =>
  `<h2 id="mt">${title}</h2><p class="mut" style="margin:8px 0 18px">${text}</p><div class="row"><button class="btn2 grow" data-act="closeModal">Cancelar</button><button class="btn danger grow" data-act="${act}" ${data}>Confirmar</button></div>`;
