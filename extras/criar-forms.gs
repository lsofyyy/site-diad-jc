/**
 * Cria o formulário de feedback do site (Google Forms) com as 3 perguntas + comentário.
 * Como usar: abra https://script.google.com → Novo projeto → cole este código →
 * clique em "Executar" (função criarFormulario) → autorize → veja o link em "Execução" (Registro).
 * Depois cole o link em FORM_URL no topo do script.js.
 */
function criarFormulario() {
  const form = FormApp.create('Sua opinião vale ouro — Curso de Desenvolvimento de Sistemas');
  form.setDescription('CETI Gov. João Clímaco D\'Almeida. Responda em menos de um minuto!');
  form.setCollectEmail(false);

  form.addMultipleChoiceItem()
    .setTitle('Você quer entrar no curso?')
    .setChoiceValues(['Sim', 'Talvez', 'Ainda não'])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('Gostou da apresentação?')
    .setBounds(1, 5)
    .setLabels('1 = não gostei', '5 = amei')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Tudo ficou incrível?')
    .setChoiceValues(['Sim', 'Quase', 'Precisa melhorar'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Quer deixar um comentário? (opcional)')
    .setRequired(false);

  Logger.log('LINK PARA RESPONDER (cole em FORM_URL): ' + form.getPublishedUrl());
  Logger.log('LINK PARA VER AS RESPOSTAS: ' + form.getEditUrl());
}
