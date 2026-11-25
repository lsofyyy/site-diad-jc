# Roteiro do Dia D — apresentação para o 9º ano

**Duração total:** cerca de 12 minutos. **Equipe:** 5 alunos. Abram o site em tela cheia (F11) e rolem de seção em seção. Ensaiem pelo menos uma vez e usem as próprias palavras: as falas abaixo são só um ponto de partida.

| # | Aluno | Tempo | Seção do site | O que mostrar |
|---|-------|-------|---------------|---------------|
| 0 | Quem abre (qualquer um) | 1 min | Início + "O que o curso oferece" | O topo, as logos, a rosquinha de cartões (arrastem com o mouse!) e a seção **Plataforma da Seduc** (bibliotecavirtual.seduc.pi.gov.br). Mostrem as **matérias do 1º ano** (cards dentro da pasta: passem o mouse e cliquem). |
| 1 | VS Code | 3 min | "Como foi feito" → aba **VS Code** + VS Code de verdade | Demo ao vivo com 3 edições (veja abaixo). Explique que o VS Code é a ferramenta que usamos para *fazer este site*; nas matérias de Pensamento Computacional e Mentorias TEC o estudo é na plataforma da Seduc. |
| 2 | HTML | 2 min | "Como foi feito" → aba **HTML** | O cartão real, tag por tag. |
| 3 | CSS | 2 min | aba **CSS** | Arrastar a duração da bolinha. |
| 4 | JavaScript | 2 min | aba **JS** (e "Laboratório ao vivo") | Botão "Executar" e o contador. |
| 5 | Deploy (GitHub Pages) | 2 min | aba **No ar** | Fluxo animado e o link do GitHub Pages. |

Fechamento (30 s, qualquer um): seção **Feedback** (QR code), pedindo que a plateia escaneie e responda. Se sobrar tempo, um **Quiz** rápido.

---

## Falas (3 a 4 linhas cada)

**Aluno 1 — VS Code (demo ao vivo)**
> "Eu vou mostrar onde a mágica acontece: o VS Code. Ele é uma **oficina**: tem a bancada e todas as ferramentas para montar um site. Olha só: eu mudo a cor no `:root`, salvo, e o site muda na hora. Quem escreve é o VS Code, quem executa é o navegador."

Três edições para a demo (VS Code de verdade, com Live Server):
1. Em `style.css`, mude `--roxo-600` no `:root` (o roxo principal muda no site todo).
2. Em `index.html`, mude o texto do `<h1 id="t-hero">` ou a frase `.hero-frase`.
3. Em `style.css`, mude a duração de uma animação (por exemplo `70s` do `girar` da rosquinha, para `8s`).

**Aluno 2 — HTML**
> "O HTML é o **esqueleto** do corpo: sem ossos nada fica de pé. Cada pedaço da página é uma 'tag': `<h3>` é um título, `<p>` é um parágrafo, `<button>` é um botão. Este cartão que vocês veem foi feito só com essas peças."

**Aluno 3 — CSS**
> "O CSS é a **roupa e a dança** da página. Ele escolhe as cores, o tamanho, as bordas arredondadas e também faz as coisas se mexerem. Esta bolinha usa um `@keyframes`: sobe e desce. Eu arrasto aqui e mudo a duração, e uma única linha muda tudo."

**Aluno 4 — JavaScript**
> "O JavaScript é o **cérebro**: pensa, decide e manda o corpo agir. Este código é a função que faz os números subirem, e é o código real deste site. Quando eu clico em 'Executar', ele conta de 0 até 100. Sem JavaScript, a página só ficaria parada."

**Aluno 5 — Deploy**
> "Como o site chega até vocês? Pensem numa **pizzaria**: a cozinha é o meu computador, o GitHub é o estoque onde a receita fica guardada e o GitHub Pages é o motoboy que entrega em casa. Eu envio o código para o GitHub, o GitHub Pages publica e eu recebo um link que qualquer pessoa abre no celular."

---

## Fechamento (qualquer aluno, 30 s)

> "Isso foi o curso de Desenvolvimento de Sistemas do João Clímaco. Agora é a vez de vocês: apontem a câmera do celular para este **QR code** e respondam o formulário. São três perguntinhas: se querem entrar no curso, se gostaram da apresentação e se a sala ficou bonita. Vale muito a opinião de vocês!"

Deixem a seção **Feedback** (`#feedback`) na tela por uns 30 segundos. Antes do Dia D, confiram em `script.js` se `FORM_URL` já tem o link do Google Forms (senão o site mostra "Defina FORM_URL no script.js") e testem o QR com um celular.

## Se perguntarem: "Vocês escreveram tudo?"

> "Usamos inteligência artificial como **apoio**, como uma calculadora ou um professor particular: ela ajudou a montar a primeira versão e a acelerar o trabalho. Mas nós sabemos explicar cada parte (HTML, CSS, JavaScript e como o site vai para o ar) e conseguimos mudar sozinhos cores, textos e animações, como vocês viram ao vivo. Aprender a usar IA entendendo o que ela entrega faz parte do curso."

*Só digam isso se for verdade para o grupo. Antes do Dia D, cada aluno deve treinar mudar uma coisa sem ajuda.*

## Checklist antes de começar
- [ ] Site aberto em tela cheia, internet não é necessária (o site funciona offline).
- [ ] VS Code aberto na pasta do projeto, com o Live Server funcionando (só para a demo).
- [ ] Cada aluno sabe qual seção é a sua e treinou a edição ao vivo.
- [ ] Plano B: se o VS Code travar, mostrem o código na aba "Como foi feito" do próprio site e façam as edições no GitHub (botão de lápis).
