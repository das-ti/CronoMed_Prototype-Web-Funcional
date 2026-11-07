# CronoMed: protótipo funcional (HTML, CSS e JS)

Abra `index.html` no navegador (ou rode `python3 -m http.server` na pasta). Não precisa de servidor nem de instalação. Os dados ficam no `localStorage`; o botão **Simulador** (canto inferior direito) dispara os eventos da caixa, da rede e do servidor.

## Arquivos
| Arquivo | Papel |
|---|---|
| `index.html` | Estrutura, padrões SVG dos compartimentos e pontos de montagem |
| `css/styles.css` | Identidade (azul #1E4F7C, Roboto), componentes e responsivo (site, tablet e app em tela estreita) |
| `js/store.js` | Regras de negócio: estado, alarmes, estoque, conciliação, permissões, pedido simulado |
| `js/views.js` | Todas as páginas e janelas (HTML) |
| `js/app.js` | Rotas (`#/...`), eventos por delegação, formulários e simulador |

## Como os eventos ligam o fluxo
Três atributos fazem toda a ligação: `data-go="#/rota"` (navegar), `data-act="nome"` (executa `ACT[nome]`) e `form[data-form="nome"]` (executa `FORM[nome]` com validação).

| Fluxo | Gatilho (evento) | Função | Resultado |
|---|---|---|---|
| Pedido | `buyNow`, `addCart` | `ACT.buyNow` | Carrinho, identificação, entrega |
| Pagamento simulado | `payForma`, `payGo` | `FORM.payForma`, `ACT.payGo` | 4 passos: forma, conferência, processamento (2 s), resultado; `placeOrder()` |
| Conta | `ckCadastro`, `cadastro` | `newUser`, `mail('ativacao')` | E-mail de ativação na caixa simulada |
| Ativação | `activate` | `ACT.activate` | Ativa a conta, inicia a sessão e abre `#/app/configurar-caixa` |
| Caixa (Bluetooth) | `btOn`, `btFound`, `btPair`, `sync` | `ACT.*`, `FORM.sync` | Ativar, localizar, ativar o dispositivo e sincronizar; `S.box` |
| Modo digital | `later` | `ACT.later` | Painel com aviso; alarme no celular; baixa pela confirmação |
| Medicamento | `med`, `timeAdd`, `repTgl`, `repIv` | `FORM.med` | Horários, dias e Repetição de alarme (2, 5, 10, 15 min) |
| Alarme | `tick()` a cada 5 s, `fire` | `alarm`, `notice` | LED no compartimento, notificação, lembretes até 12 em 1 h |
| Sensor | `sensor` | `openSlot` | Registra a abertura e interrompe o alarme |
| Confirmação | `confirmYes`, `voice` | `confirmDose` | Fila de eventos com UUID |
| Conciliação | `net`, `syncNow` | `sync` | Baixa do estoque, histórico (Tomada, Sem confirmação, Perdida) |
| Estoque | `refill` | `FORM.refill` | Soma ao estoque; alertas de estoque baixo |
| Convite | `invite`, `permPick` | `FORM.invite` | Matriz de 7 módulos (Visualização ou Gerenciamento) |
| Convidado | `convite1..3`, `tipo` | `FORM.convite*` | COREN, ou CRM e especialidade; sessão do convidado com permissões aplicadas por `can(modulo, nivel)` |

## Rotas
Público: `#/`, `#/pedido/(produto|carrinho|identificacao|entrega|pagamento|confirmado)`, `#/entrar`, `#/cadastro`, `#/verifique-email`, `#/esqueci`, `#/email-enviado`, `#/nova-senha/:token`, `#/senha-alterada`, `#/emails`, `#/convite/:id`, `#/convite/concluido`.
Logado: `#/app/(configurar-caixa|doses|medicamentos[/n]|estoque|historico|compartilhamento|dispositivos|configuracoes|alterar-cadastro|seguranca|pedidos[/id])`.

## Roteiro rápido
1. Landing, Faça seu pedido, Comprar agora, criar conta, entrega, pagamento (Finalizar).
2. `#/emails`, abrir "Ative sua conta" e clicar em Ativar: a configuração da caixa abre sozinha.
3. Ativar Bluetooth, Continuar, Ativar caixa, Sincronizar. Ou "Configurar depois" para o modo digital.
4. Cadastrar um medicamento com horário próximo; no Simulador, avance o relógio, dispare o alarme, abra o compartimento e confirme a dose.
5. Compartilhamento: convide uma pessoa, abra o e-mail de convite e conclua o cadastro como Médico (CRM).

## Limites desta versão
Tudo roda no navegador (sem servidor). Pagamento, frete, e-mails, Bluetooth e biometria são simulados. O aplicativo Android nativo reimplementa as mesmas regras; aqui ele aparece como o layout de tela estreita. Voz usa a Web Speech API (Chrome, Edge e Safari, com internet).
