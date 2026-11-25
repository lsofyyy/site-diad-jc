/* =========================================================
   script.js — o "cérebro" do site
   Cada bloco é marcado com um comentário em português.
   ========================================================= */

/* ---------- CONFIGURAÇÃO: link do formulário de feedback ----------
   Cole aqui o link do Google Forms. O QR code do site é gerado a partir dele. */
const FORM_URL = "COLE_AQUI_O_LINK_DO_GOOGLE_FORMS";

/* ---------- 0. PREPARAÇÃO ---------- */
// avisa o CSS que o JavaScript está funcionando (ativa o efeito reveal)
document.documentElement.classList.add("js");

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- 1. REALCE DE SINTAXE (feito à mão, sem biblioteca) ----------
   Cada linguagem tem uma lista de regras: [padrão, classe de cor].
   O primeiro padrão que combinar naquele ponto do texto vence. */
const REGRAS = {
  html: [
    ["<!--[\\s\\S]*?-->", "comment"],
    ["<\\/?[\\w!-]+", "tag"],
    ["\\s[\\w-]+(?==)", "attr"],
    ['"[^"]*"', "string"],
    ["\\/?>", "bracket"],
  ],
  css: [
    ["\\/\\*[\\s\\S]*?\\*\\/", "comment"],
    ["[^{}\\n;]+(?=\\s*\\{)", "selector"],
    ["[\\w-]+(?=\\s*:)", "prop"],
    ["#[0-9a-fA-F]{3,8}\\b|-?\\d+(?:\\.\\d+)?(?:px|rem|em|s|%|vh|deg)?", "value"],
  ],
  js: [
    ["\\/\\/[^\\n]*", "comment"],
    ["\"[^\"\\n]*\"|'[^'\\n]*'|`[^`]*`", "string"],
    ["\\b(?:const|let|var|function|return|if|else|for|while|new|true|false|null|class|of|in)\\b", "keyword"],
    ["\\b\\d+(?:\\.\\d+)?\\b", "number"],
    ["\\b[A-Za-z_$][\\w$]*(?=\\()", "func"],
  ],
  py: [
    ["#[^\\n]*", "comment"],
    ["\"[^\"\\n]*\"|'[^'\\n]*'", "string"],
    ["\\b(?:for|in|range|def|if|else|return|import|True|False)\\b", "keyword"],
    ["\\b\\d+\\b", "number"],
    ["\\b[A-Za-z_]\\w*(?=\\()", "func"],
  ],
  sh: [
    ["#[^\\n]*", "comment"],
    ["\"[^\"\\n]*\"", "string"],
    ["\\bgit\\b", "keyword"],
    ["\\b(?:add|commit|push|init|status|clone)\\b", "func"],
  ],
  sql: [
    ["\\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|DELETE|AND|OR)\\b", "keyword"],
    ["'[^']*'", "string"],
    ["\\b\\d+\\b", "number"],
  ],
};
REGRAS.md = []; REGRAS.gitignore = [];

// transforma texto puro em HTML com <span class="tk-...">
function realcar(codigo, lang) {
  const regras = REGRAS[lang];
  if (!regras || !regras.length) return esc(codigo);
  const re = new RegExp(regras.map((r) => "(" + r[0] + ")").join("|"), "g");
  let saida = "", fim = 0, m;
  while ((m = re.exec(codigo))) {
    if (m[0] === "") { re.lastIndex++; continue; }
    saida += esc(codigo.slice(fim, m.index));
    const qual = m.slice(1).findIndex((g) => g !== undefined);
    saida += `<span class="tk-${regras[qual][1]}">${esc(m[0])}</span>`;
    fim = re.lastIndex;
  }
  return saida + esc(codigo.slice(fim));
}

/* ---------- 2. CONTADOR ANIMADO ----------
   Esta função aparece na aba "JS" do site: o código mostrado é ESTE! */
function animarContador(el, alvo, duracao = 1500) {
  // Anima o número de 0 até o alvo
  const inicio = performance.now();
  function passo(agora) {
    const t = Math.min((agora - inicio) / duracao, 1);
    el.textContent = Math.round(alvo * t);
    if (t < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

/* ---------- 3. TRECHOS REAIS NA ABA "COMO FOI FEITO" ---------- */
(function trechosReais() {
  // HTML: copia o primeiro cartão do curso, direto da página
  const cartao = $("#curso .cartao").cloneNode(true);
  cartao.classList.remove("visivel");
  const linhas = cartao.outerHTML.split("\n");
  const recuos = linhas.slice(1).filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length);
  const menor = recuos.length ? Math.min(...recuos) : 0;
  $("#html-real").textContent = linhas.map((l, i) => (i ? l.slice(menor) : l)).join("\n");
  // JS: mostra o texto da função animarContador
  $("#js-real").textContent = animarContador.toString();
  // realça todos os blocos de código marcados com data-lang
  $$("code[data-lang]").forEach((c) => { c.innerHTML = realcar(c.textContent, c.dataset.lang); });
})();

/* ---------- 4. REVEAL AO ROLAR (IntersectionObserver) ---------- */
const obsReveal = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visivel"); obsReveal.unobserve(e.target); }
  });
}, { threshold: 0.15 });
$$(".reveal").forEach((el) => obsReveal.observe(el));

/* ---------- 5. CONTADORES: começam quando aparecem na tela ---------- */
const obsContador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (!e.isIntersecting) return;
    const alvo = +e.target.dataset.alvo;
    if (reduzir) e.target.textContent = alvo; else animarContador(e.target, alvo);
    obsContador.unobserve(e.target);
  });
}, { threshold: 0.6 });
$$(".contador strong").forEach((el) => obsContador.observe(el));

/* ---------- 6. DIGITAÇÃO NO HERO ---------- */
(function digitacao() {
  const alvo = $("#digitando");
  const palavras = ["sites", "aplicativos", "jogos", "o seu futuro"];
  if (reduzir) return; // sem movimento: deixa a primeira palavra parada
  let p = 0, c = 0, apagando = false;
  function ciclo() {
    const palavra = palavras[p];
    c += apagando ? -1 : 1;
    alvo.textContent = palavra.slice(0, c);
    let espera = apagando ? 45 : 90;
    if (!apagando && c === palavra.length) { apagando = true; espera = 1400; }
    else if (apagando && c === 0) { apagando = false; p = (p + 1) % palavras.length; espera = 400; }
    setTimeout(ciclo, espera);
  }
  alvo.textContent = ""; ciclo();
})();

/* ---------- 7. ROLAGEM: progresso, menu ativo e menu transparente ---------- */
const secoes = $$("[data-secao]");
const links = $$("#menu a");
let atual = 0, ticking = false;
function aoRolar() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $("#progresso").style.setProperty("--p", max > 0 ? scrollY / max : 0);
  let novo = 0;
  secoes.forEach((s, i) => { if (s.getBoundingClientRect().top <= innerHeight * 0.4) novo = i; });
  // chegou ao fim da página? marca a última seção
  if (max > 0 && scrollY >= max - 4) novo = secoes.length - 1;
  if (novo !== atual || !links.some((l) => l.classList.contains("ativo"))) {
    atual = novo;
    links.forEach((l, i) => {
      l.classList.toggle("ativo", i === atual);
      if (i === atual) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
    });
    const menu = $("#menu");
    menu.scrollTo({ left: links[atual].offsetLeft - menu.clientWidth / 2, behavior: "auto" });
  }
  // menu transparente sobre as seções escuras (hero e rodapé); claro sobre as outras
  const sobreEscuro = $$(".escuro").some((e) => { const r = e.getBoundingClientRect(); return r.top <= 50 && r.bottom >= 50; });
  $(".topo").classList.toggle("claro", !sobreEscuro);
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(aoRolar); } }, { passive: true });
addEventListener("resize", aoRolar);
aoRolar();

/* ---------- 8. CARTÕES 3D QUE VIRAM ---------- */
$$(".flip").forEach((card) => {
  const virar = () => {
    const virado = card.classList.toggle("virado");
    card.setAttribute("aria-pressed", virado);
  };
  card.addEventListener("click", virar);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); virar(); }
  });
});

/* ---------- 9. LABORATÓRIO AO VIVO ---------- */
const EXEMPLOS = {
  botao: {
    html: '<button id="b">Clique em mim</button>',
    css: "button {\n  font-size: 1.4rem;\n  padding: .8rem 1.6rem;\n  border: 0;\n  border-radius: 12px;\n  background: #a21cf0;\n  color: white;\n  cursor: pointer;\n}",
    js: "const b = document.getElementById('b');\nconst cores = ['#a21cf0', '#1f6fb8', '#be185d', '#fbbf24'];\nlet i = 0;\nb.addEventListener('click', () => {\n  i = (i + 1) % cores.length;\n  b.style.background = cores[i];\n});",
  },
  contador: {
    html: '<h1 id="n">0</h1>\n<button id="mais">+1</button>',
    css: "h1 { font-size: 4rem; margin: 0; color: #7a0fb8; }\nbutton { font-size: 1.2rem; padding: .6rem 1.4rem; border-radius: 10px; border: 0; background: #a21cf0; color: #fff; cursor: pointer; }",
    js: "let total = 0;\ndocument.getElementById('mais').onclick = () => {\n  total++;\n  document.getElementById('n').textContent = total;\n};",
  },
  cartao: {
    html: '<div class="cartao">Olá, 9º ano! 👋</div>',
    css: ".cartao {\n  padding: 2rem 3rem;\n  border-radius: 20px;\n  background: linear-gradient(135deg, #7a0fb8, #1f6fb8);\n  color: white;\n  font-size: 1.5rem;\n  animation: balancar 2s ease-in-out infinite;\n}\n@keyframes balancar {\n  0%, 100% { transform: rotate(-4deg); }\n  50% { transform: rotate(4deg) scale(1.08); }\n}",
    js: "// Este exemplo não precisa de JavaScript.\n// Tente mudar a duração (2s) no CSS!",
  },
};
const lab = { html: $("#lab-html"), css: $("#lab-css"), js: $("#lab-js"), iframe: $("#lab-iframe") };
let exemploAtual = "botao", tLab;
function renderLab() {
  // junta HTML + CSS + JS em um documento e entrega ao iframe
  lab.iframe.srcdoc = "<!doctype html><meta charset='utf-8'><style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:90vh;margin:0;text-align:center}</style>" +
    "<style>" + lab.css.value + "</style>" + lab.html.value + "<script>" + lab.js.value + "<\/script>";
}
function carregarExemplo(nome) {
  exemploAtual = nome;
  const ex = EXEMPLOS[nome];
  lab.html.value = ex.html; lab.css.value = ex.css; lab.js.value = ex.js;
  renderLab();
}
["html", "css", "js"].forEach((k) => lab[k].addEventListener("input", () => {
  clearTimeout(tLab); tLab = setTimeout(renderLab, 250); // espera 0,25s depois de digitar
}));
$$("[data-exemplo]").forEach((b) => b.addEventListener("click", () => carregarExemplo(b.dataset.exemplo)));
$("#lab-restaurar").addEventListener("click", () => carregarExemplo(exemploAtual));
carregarExemplo("botao");

/* ---------- 10. VS CODE SIMULADO ---------- */
const ARQUIVOS = {
  "index.html": { lang: "html", code: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>Meu site</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1 id="titulo">Olá, mundo!</h1>\n  <button id="botao">Mudar cor</button>\n  <script src="script.js"><\/script>\n</body>\n</html>' },
  "style.css": { lang: "css", code: ":root {\n  --cor: #a21cf0;\n}\nbody {\n  font-family: system-ui;\n  text-align: center;\n  padding: 2rem;\n}\nh1 {\n  color: var(--cor);\n}\nbutton {\n  padding: 10px 18px;\n  border: 0;\n  border-radius: 10px;\n  background: var(--cor);\n  color: white;\n  cursor: pointer;\n}" },
  "script.js": { lang: "js", code: '// Troca a cor do título ao clicar\nconst titulo = document.getElementById("titulo");\nconst botao = document.getElementById("botao");\nbotao.addEventListener("click", () => {\n  titulo.style.color = "#be185d";\n});' },
  "README.md": { lang: "md", code: "# Meu site\n\nProjeto do curso de Desenvolvimento de Sistemas.\nAbra o index.html no navegador." },
  ".gitignore": { lang: "gitignore", code: "node_modules/\n.env\n.DS_Store" },
};
Object.values(ARQUIVOS).forEach((a) => { a.salvo = a.code; });
const vsc = { abertas: [], ativo: null };
const edVsc = $("#vsc-editor");
// alguns navegadores não aceitam "plaintext-only": usa "true" como plano B
if (edVsc.contentEditable !== "plaintext-only") edVsc.contentEditable = "true";

function desenharAbas() {
  const barra = $("#vsc-abas");
  barra.innerHTML = "";
  vsc.abertas.forEach((nome) => {
    const b = document.createElement("button");
    b.className = "aba" + (nome === vsc.ativo ? " ativo" : "") + (ARQUIVOS[nome].code !== ARQUIVOS[nome].salvo ? " sujo" : "");
    b.setAttribute("role", "tab"); b.setAttribute("aria-selected", nome === vsc.ativo);
    b.textContent = nome;
    b.addEventListener("click", () => abrirArquivo(nome));
    barra.append(b);
  });
  $$(".arq[data-arq]").forEach((a) => a.classList.toggle("ativo", a.dataset.arq === vsc.ativo));
}
function abrirArquivo(nome) {
  if (vsc.ativo) ARQUIVOS[vsc.ativo].code = edVsc.textContent; // guarda o que foi digitado
  if (!vsc.abertas.includes(nome)) vsc.abertas.push(nome);
  vsc.ativo = nome;
  edVsc.innerHTML = realcar(ARQUIVOS[nome].code, ARQUIVOS[nome].lang);
  desenharAbas();
}
// monta a prévia: troca <link> e <script src> pelo conteúdo dos outros arquivos
function previaVsc() {
  const html = ARQUIVOS["index.html"].salvo
    .replace(/<link[^>]*style\.css[^>]*>/, () => "<style>" + ARQUIVOS["style.css"].salvo + "</style>")
    .replace(/<script[^>]*script\.js[^>]*><\/script>/, () => "<script>" + ARQUIVOS["script.js"].salvo + "<\/script>");
  $("#vsc-iframe").srcdoc = html;
}
function salvarVsc() {
  ARQUIVOS[vsc.ativo].code = edVsc.textContent;
  Object.values(ARQUIVOS).forEach((a) => { a.salvo = a.code; });
  edVsc.innerHTML = realcar(ARQUIVOS[vsc.ativo].code, ARQUIVOS[vsc.ativo].lang);
  desenharAbas(); previaVsc();
}
edVsc.addEventListener("input", () => { // marca a aba com "●" enquanto não salvou
  ARQUIVOS[vsc.ativo].code = edVsc.textContent; desenharAbas();
});
edVsc.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); salvarVsc(); }
});
$("#vsc-salvar").addEventListener("click", salvarVsc);
$$(".arq[data-arq]").forEach((b) => b.addEventListener("click", () => {
  if (b.dataset.arq === "assets") { // pasta: abre/fecha
    const pasta = $("#pasta-assets");
    pasta.hidden = !pasta.hidden;
    b.textContent = (pasta.hidden ? "▸" : "▾") + " 📁 assets";
  } else abrirArquivo(b.dataset.arq);
}));

// terminal: digita os comandos do git um por um
let fichaTerm = 0;
const PASSOS_GIT = [
  { cmd: "git add .", saida: "" },
  { cmd: 'git commit -m "primeiro commit"', saida: "[main 3f2a1c9] primeiro commit\n 5 files changed, 420 insertions(+)" },
  { cmd: "git push origin main", saida: "Enumerating objects: 9, done.\nWriting objects: 100% (9/9), done.\nTo github.com:escola/meu-site.git\n * [new branch]      main -> main" },
];
async function rodarGit() {
  const minha = ++fichaTerm, term = $("#vsc-terminal");
  term.innerHTML = "";
  for (const passo of PASSOS_GIT) {
    const linha = document.createElement("div");
    linha.innerHTML = '<span class="t-cmd">$ </span>';
    const txt = document.createElement("span");
    linha.append(txt); term.append(linha);
    for (const letra of passo.cmd) {
      txt.textContent += letra; await esperar(reduzir ? 0 : 35);
      if (minha !== fichaTerm) return;
    }
    await esperar(reduzir ? 0 : 350);
    if (passo.saida) { const s = document.createElement("div"); s.textContent = passo.saida; term.append(s); }
    await esperar(reduzir ? 0 : 500);
    if (minha !== fichaTerm) return;
  }
  const fim = document.createElement("div");
  fim.innerHTML = '<span class="t-cmd">$ </span><span class="t-cursor"></span>';
  term.append(fim);
}
$("#vsc-git").addEventListener("click", rodarGit);
abrirArquivo("index.html"); previaVsc();

/* ---------- 11. QUIZ ---------- */
const PERGUNTAS = [
  { p: "Qual linguagem monta o “esqueleto” de uma página web?", o: ["HTML", "CSS", "SQL", "Git"], c: 0, d: "HTML define títulos, textos e botões." },
  { p: "Para que serve o CSS?", o: ["Guardar dados", "Deixar a página bonita", "Enviar e-mails", "Consertar o computador"], c: 1, d: "CSS cuida de cores, tamanhos e animações." },
  { p: "Em let idade = 14; o que é “idade”?", o: ["Uma variável", "Um erro", "Uma imagem", "Um site"], c: 0, d: "Variável é uma caixinha com nome que guarda um valor." },
  { p: "Para que serve o Git?", o: ["Fazer desenhos", "Guardar o histórico do código", "Aumentar a internet", "Abrir sites"], c: 1, d: "Git é uma máquina do tempo para o código." },
];
const caixaQuiz = $("#quiz-caixa");
let qi = 0, pontos = 0;
function mostrarPergunta() {
  const q = PERGUNTAS[qi];
  caixaQuiz.innerHTML = `
    <div class="quiz-topo"><span>Pergunta ${qi + 1} de ${PERGUNTAS.length}</span><span>Pontos: ${pontos}</span></div>
    <div class="quiz-barra" aria-hidden="true"><div style="width:${(qi / PERGUNTAS.length) * 100}%"></div></div>
    <h3>${esc(q.p)}</h3>
    <div class="opcoes">${q.o.map((t, i) => `<button class="opcao" data-i="${i}">${esc(t)}</button>`).join("")}</div>
    <p class="feedback" role="status"></p>
    <button class="btn" id="quiz-prox" hidden></button>`;
  $$(".opcao", caixaQuiz).forEach((b) => b.addEventListener("click", () => responder(+b.dataset.i)));
}
function responder(i) {
  const q = PERGUNTAS[qi], ok = i === q.c;
  const botoes = $$(".opcao", caixaQuiz);
  botoes.forEach((b) => (b.disabled = true));
  botoes[i].classList.add(ok ? "certa" : "errada");
  botoes[q.c].classList.add("certa");
  if (ok) pontos++;
  const fb = $(".feedback", caixaQuiz);
  fb.className = "feedback " + (ok ? "ok" : "erro");
  fb.textContent = (ok ? "✅ Isso aí! " : "❌ Quase! ") + q.d;
  const prox = $("#quiz-prox");
  prox.hidden = false;
  prox.textContent = qi === PERGUNTAS.length - 1 ? "Ver resultado" : "Próxima →";
  prox.addEventListener("click", () => { qi++; qi < PERGUNTAS.length ? mostrarPergunta() : fimQuiz(); });
  prox.focus();
}
function fimQuiz() {
  const msg = pontos === PERGUNTAS.length ? "Você já pensa como programador! 🏆" : pontos >= 2 ? "Muito bem! Falta pouco para virar craque. 💪" : "Sem problema: no curso você aprende tudo isso. 🌱";
  caixaQuiz.innerHTML = `<div class="quiz-fim"><div class="nota">${pontos}/${PERGUNTAS.length}</div><h3>${msg}</h3><button class="btn" id="quiz-again">↺ Jogar de novo</button></div>`;
  $("#quiz-again").addEventListener("click", () => { qi = 0; pontos = 0; mostrarPergunta(); });
}
mostrarPergunta();

/* ---------- 12. ABAS "COMO FOI FEITO" ---------- */
const abasSite = $$("#abas-site [role=tab]");
function mostrarAba(aba, foco) {
  abasSite.forEach((a) => {
    const ativa = a === aba;
    a.setAttribute("aria-selected", ativa);
    a.tabIndex = ativa ? 0 : -1;
    $("#" + a.getAttribute("aria-controls")).hidden = !ativa;
  });
  if (foco) aba.focus();
  if (aba.id === "tab-ar") rodarFluxo();
}
abasSite.forEach((a, i) => {
  a.addEventListener("click", () => mostrarAba(a));
  a.addEventListener("keydown", (e) => { // setas, Home e End navegam entre as abas
    const n = abasSite.length;
    const alvo = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (alvo !== undefined) { e.preventDefault(); mostrarAba(abasSite[alvo], true); }
  });
});
// CSS: o controle deslizante muda a variável --dur da bolinha
$("#dur-range").addEventListener("input", (e) => {
  $("#bolinha").style.setProperty("--dur", e.target.value + "s");
  $("#dur-valor").textContent = Number(e.target.value).toFixed(1) + "s";
});
// JS: botão que executa o código mostrado
$("#btn-exec").addEventListener("click", () => animarContador($("#demo-contador"), 100));
// No ar: reinicia a animação do fluxo
function rodarFluxo() {
  const f = $("#fluxo");
  f.classList.remove("rodando"); void f.offsetWidth; // força o navegador a "reiniciar"
  f.classList.add("rodando");
}
$("#btn-fluxo").addEventListener("click", rodarFluxo);

/* ---------- 13. HERO: símbolos de programação no fundo ---------- */
(function simbolos() {
  const caixa = $("#simbolos");
  const lista = ["</>", "{ }", "( )", "[ ]", ";", "=>", "&&", "||", "//", "#", "01", "10", "<div>", "fn()", "if", "=", "!=", "++", "const", "$", "%", "*", "<>", "..", "0x", "return", "{ ; }", "</>"];
  const cores = ["#ffffff", "#d8a8ff", "#fbbf24", "#a5d8ff"];
  // posições "espalhadas" calculadas com números fixos (sempre iguais, sem sorteio)
  lista.forEach((txt, i) => {
    const sim = document.createElement("div");
    sim.className = "sim";
    const x = (i * 37 + 7) % 96, y = (i * 53 + 11) % 92;
    sim.style.cssText = `--x:${x}%;--y:${y}%;--p:${6 + (i % 5) * 5}`;
    const sp = document.createElement("span");
    sp.textContent = txt;
    sp.style.cssText = `--s:${1.1 + (i % 4) * 0.7}rem;--c:${cores[i % cores.length]};--o:${0.14 + (i % 3) * 0.07};--d:${9 + (i % 6) * 2}s;--dl:-${(i * 1.7).toFixed(1)}s`;
    sim.append(sp); caixa.append(sim);
  });
})();

/* ---------- 14. HERO: o mouse move o fundo e inclina as logos em 3D ---------- */
(function mouse3d() {
  const hero = $("#hero");
  if (reduzir || !matchMedia("(pointer: fine)").matches) return;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;   // -0,5 a 0,5
    const ny = (e.clientY - r.top) / r.height - 0.5;
    hero.style.setProperty("--mx", (nx * -2).toFixed(2)); // parallax dos símbolos
    hero.style.setProperty("--my", (ny * -2).toFixed(2));
    $$(".logo-3d", hero).forEach((l) => {                 // inclinação das logos
      l.style.setProperty("--ry", (nx * 28).toFixed(1) + "deg");
      l.style.setProperty("--rx", (ny * -28).toFixed(1) + "deg");
    });
  });
  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--mx", 0); hero.style.setProperty("--my", 0);
    $$(".logo-3d", hero).forEach((l) => { l.style.setProperty("--ry", "0deg"); l.style.setProperty("--rx", "0deg"); });
  });
})();

/* ---------- 15. GERADOR DE QR CODE (JavaScript puro, saída em SVG) ----------
   Modo byte (UTF-8), correção de erro M, versão escolhida pelo tamanho do texto.
   Passos: texto → bytes → códigos de correção (Reed-Solomon) → desenho dos módulos → máscara. */
function gerarQR(texto) {
  const ECC_BLOCO = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
  const N_BLOCOS = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];
  const bytes = [...new TextEncoder().encode(texto)];
  // quantos módulos de dados cabem em cada versão
  const brutos = (v) => {
    let r = (16 * v + 128) * v + 64;
    if (v >= 2) { const a = Math.floor(v / 7) + 2; r -= (25 * a - 10) * a - 55; if (v >= 7) r -= 36; }
    return r;
  };
  const capacidade = (v) => Math.floor(brutos(v) / 8) - ECC_BLOCO[v] * N_BLOCOS[v];
  let ver = 1;
  while (ver <= 40 && 4 + (ver < 10 ? 8 : 16) + bytes.length * 8 > capacidade(ver) * 8) ver++;
  if (ver > 40) return null; // texto grande demais

  // 1) bits de dados: modo byte + tamanho + bytes + terminador + enchimento
  const bits = [];
  const poe = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  poe(4, 4); poe(bytes.length, ver < 10 ? 8 : 16); bytes.forEach((b) => poe(b, 8));
  poe(0, Math.min(4, capacidade(ver) * 8 - bits.length));
  poe(0, (8 - bits.length % 8) % 8);
  const dados = [];
  for (let i = 0; i < bits.length; i += 8) dados.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  for (let pad = 0xEC; dados.length < capacidade(ver); pad ^= 0xEC ^ 0x11) dados.push(pad);

  // 2) correção de erros Reed-Solomon (aritmética no campo GF(256))
  const mul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; };
  const divisor = (d) => {
    const r = new Array(d).fill(0); r[d - 1] = 1; let raiz = 1;
    for (let i = 0; i < d; i++) { for (let j = 0; j < d; j++) { r[j] = mul(r[j], raiz); if (j + 1 < d) r[j] ^= r[j + 1]; } raiz = mul(raiz, 2); }
    return r;
  };
  const resto = (dat, div) => {
    const r = div.map(() => 0);
    dat.forEach((b) => { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= mul(c, f); }); });
    return r;
  };
  const nb = N_BLOCOS[ver], eccLen = ECC_BLOCO[ver], total = Math.floor(brutos(ver) / 8);
  const curtos = nb - total % nb, lenCurto = Math.floor(total / nb), div = divisor(eccLen);
  const blocos = [];
  for (let i = 0, k = 0; i < nb; i++) {
    const dat = dados.slice(k, k + lenCurto - eccLen + (i < curtos ? 0 : 1)); k += dat.length;
    const ecc = resto(dat, div);
    if (i < curtos) dat.push(0);
    blocos.push(dat.concat(ecc));
  }
  const final = [];
  for (let i = 0; i < blocos[0].length; i++) blocos.forEach((b, j) => { if (i !== lenCurto - eccLen || j >= curtos) final.push(b[i]); });

  // 3) matriz de módulos: padrões fixos (localizadores, alinhamento, tempo)
  const n = ver * 4 + 17;
  const mod = Array.from({ length: n }, () => new Array(n).fill(false));
  const fixo = Array.from({ length: n }, () => new Array(n).fill(false));
  const set = (x, y, v) => { mod[y][x] = v; fixo[y][x] = true; };
  for (let i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  [[3, 3], [n - 4, 3], [3, n - 4]].forEach(([x, y]) => {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const d = Math.max(Math.abs(dx), Math.abs(dy)), xx = x + dx, yy = y + dy;
      if (xx >= 0 && xx < n && yy >= 0 && yy < n) set(xx, yy, d !== 2 && d !== 4);
    }
  });
  const pos = [];
  if (ver > 1) {
    const na = Math.floor(ver / 7) + 2, passo = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (na * 2 - 2)) * 2;
    pos.push(6); for (let p = n - 7; pos.length < na; p -= passo) pos.splice(1, 0, p);
  }
  pos.forEach((x, i) => pos.forEach((y, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === pos.length - 1) || (i === pos.length - 1 && j === 0)) return;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }));
  const formato = (mask) => { // bits de formato (nível M = 0) protegidos por código BCH
    const d = (0 << 3) | mask; let r = d;
    for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const b = ((d << 10) | r) ^ 0x5412, bit = (i) => ((b >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(n - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, n - 15 + i, bit(i));
    set(8, n - 8, true);
  };
  formato(0); // reserva a área; é redesenhada com a máscara escolhida
  if (ver >= 7) {
    let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
    const b = (ver << 12) | r;
    for (let i = 0; i < 18; i++) { const a = n - 11 + i % 3, c = Math.floor(i / 3), v = ((b >>> i) & 1) === 1; set(a, c, v); set(c, a, v); }
  }

  // 4) coloca os bits de dados em zigue-zague, de baixo para cima, em colunas duplas
  let k = 0;
  for (let dir = n - 1; dir >= 1; dir -= 2) {
    if (dir === 6) dir = 5;
    for (let v = 0; v < n; v++) for (let j = 0; j < 2; j++) {
      const x = dir - j, y = ((dir + 1) & 2) === 0 ? n - 1 - v : v;
      if (!fixo[y][x] && k < final.length * 8) { mod[y][x] = ((final[k >>> 3] >>> (7 - (k & 7))) & 1) === 1; k++; }
    }
  }

  // 5) escolhe a máscara com menor "penalidade" (evita padrões que confundem a câmera)
  const MASCARAS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
    (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
  const penalidade = (m) => {
    let p = 0;
    const linhas = [...m.map((l) => l.map(Number).join("")), ...m[0].map((_, x) => m.map((l) => +l[x]).join(""))];
    linhas.forEach((l) => {
      (l.match(/0{5,}|1{5,}/g) || []).forEach((r) => { p += 3 + r.length - 5; });
      p += 40 * (l.match(/(?=(0000)?1011101(0000)?)/g) || []).length;
    });
    for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) if (m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) p += 3;
    const escuros = m.flat().filter(Boolean).length;
    return p + Math.floor(Math.abs(escuros * 20 - n * n * 10) / (n * n)) * 10;
  };
  let melhor = null, melhorP = Infinity;
  for (let mk = 0; mk < 8; mk++) {
    const m = mod.map((l) => l.slice());
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!fixo[y][x] && MASCARAS[mk](x, y)) m[y][x] = !m[y][x];
    const p = penalidade(m);
    if (p < melhorP) { melhorP = p; melhor = { m, mk }; }
  }
  formato(melhor.mk);
  // refaz só a área de formato na matriz escolhida
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (fixo[y][x] && (x < 9 && y < 9 || x < 9 && y >= n - 8 || x >= n - 8 && y < 9)) melhor.m[y][x] = mod[y][x];
  return { tamanho: n, versao: ver, modulos: melhor.m };
}

// transforma a matriz em SVG: quadrado escuro sobre fundo branco, com borda de silêncio de 4 módulos
function qrParaSVG(qr) {
  const borda = 4, t = qr.tamanho + borda * 2;
  let linhas = "";
  qr.modulos.forEach((linha, y) => {
    let d = "";
    linha.forEach((escuro, x) => { if (escuro) d += `M${x + borda} ${y + borda}h1v1h-1z`; });
    if (d) linhas += `<path class="qr-linha" style="--r:${y}" d="${d}" fill="#000"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t} ${t}" shape-rendering="crispEdges" aria-hidden="true"><rect width="${t}" height="${t}" fill="#fff"/>${linhas}</svg>`;
}

/* ---------- 16. SEÇÃO FEEDBACK: mostra o QR e o botão ---------- */
function montarFeedback(url) {
  const caixa = $("#qr-caixa"), botao = $("#qr-botao"), txt = $("#qr-url");
  caixa.classList.remove("visivel");
  if (!url || url === "COLE_AQUI_O_LINK_DO_GOOGLE_FORMS") { // link ainda não definido: não gera QR inválido
    caixa.innerHTML = '<p class="qr-aviso">Defina FORM_URL no script.js</p>';
    botao.hidden = true; txt.textContent = ""; return;
  }
  const qr = gerarQR(url);
  if (!qr) { caixa.innerHTML = '<p class="qr-aviso">Link grande demais para o QR.</p>'; return; }
  caixa.innerHTML = qrParaSVG(qr);
  botao.hidden = false; botao.href = url; txt.textContent = url;
  // o QR "desenha" quando o cartão aparece na tela
  if (reduzir) caixa.classList.add("visivel"); else obsQR.observe(caixa);
}
const obsQR = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("visivel"); obsQR.unobserve(e.target); }
}), { threshold: 0.4 });
montarFeedback(FORM_URL);
