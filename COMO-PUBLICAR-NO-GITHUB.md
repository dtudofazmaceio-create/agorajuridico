# Publicar o Ágora Jurídica no GitHub (grátis)

**Como funciona:**
- O **site** fica no **GitHub Pages**, num endereço como `https://SEU-USUARIO.github.io/agora-juridica/`.
- O **conteúdo** (materiais, PDFs, áudios, vagas, concursos, leis e configurações) fica num **Gist secreto** da sua conta, criado automaticamente pelo portal.
- Você publica tudo pelo **Painel administrativo** do próprio portal. Não precisa editar código.
- Os alunos abrem o link, criam a conta e ganham **30 dias grátis**. Depois, você envia um **código de acesso** a quem pagar.

---

## Passo 1: subir o site (5 minutos)
1. Entre no GitHub e clique em **New repository**.
   - Nome: `agora-juridica` (ou outro). Marque **Public** (o GitHub Pages grátis exige repositório público).
   - Clique em **Create repository**.
2. Na página do repositório, clique em **uploading an existing file**.
3. Arraste **todo o conteúdo da pasta `public`**: `index.html`, `manifest.webmanifest`, `sw.js`, `leis-sync.mjs` e as pastas `icons` e `scripts`. Clique em **Commit changes**. (A pasta `.github` é criada à parte; veja **Atualização automática das leis**.)
4. Vá em **Settings → Pages**. Em *Branch*, escolha `main` e a pasta `/ (root)`. Clique em **Save**.
5. Em 1 a 2 minutos, o site estará em `https://SEU-USUARIO.github.io/agora-juridica/`.

## Passo 2: conectar o portal ao GitHub (3 minutos, uma única vez)
> **Recomendado:** crie uma conta do GitHub só para o portal (ex.: `agorajuridica-dados`) e gere o token nela.
> O token fica dentro do portal e pode ser descoberto por quem tiver o link e conhecimento técnico.
> Numa conta exclusiva, ele só dá acesso aos dados do próprio portal.

1. Abra o endereço do site terminando em **`#/configurar`** (ex.: `https://SEU-USUARIO.github.io/agorajuridico/#/configurar`). Essa tela é só para o administrador e não aparece para os alunos. Clique em **Criar o portal com o GitHub**.
2. Clique em **GitHub → Novo token (classic)**. A permissão **gist** já vem marcada. Em *Expiration*, escolha **No expiration** e gere o token (`ghp_...`).
3. Cole o token e preencha **seu nome, e-mail e senha de administrador**. Clique em **Criar portal**.
4. O portal cria dois Gists secretos: um com os conteúdos e outro com os cadastros dos alunos. Depois mostra o **link para os alunos**.

A partir daí você entra como qualquer usuário, com **e-mail e senha**, em qualquer computador ou celular. O token não é pedido de novo.

**Já usava a versão anterior?** Abra o site terminando em **`#/configurar`** e clique em **Concluir configuração**. Cole o token uma última vez e crie sua conta de administrador. Os conteúdos que já estão no Gist continuam lá.

**Se o token expirar ou for desativado:** entre com seu e-mail e senha e vá em **Painel → Configurações → Atualizar token do GitHub**.

## Passo 3: publicar conteúdo
No **Painel administrativo**:
- **Materiais:**
  - **Vídeos e áudios:** sempre por link do **YouTube** (pode ser "não listado") ou do **Google Drive**. No Drive, abra o arquivo, clique em **Compartilhar** e mude para **Qualquer pessoa com o link**.
  - **PDFs:** escolha ou arraste o arquivo (até 4 MB). O portal lê sozinho o **título/tema, o autor e o número de páginas**, preenche a **descrição com o subtítulo** do PDF e sugere a **disciplina**, e extrai a **capa real** (primeira página) para mostrar no lugar da ilustração genérica. Você pode trocar a capa por outra imagem. PDFs enviados antes desta versão ganham capa automaticamente quando o administrador entra no portal (ou pelo botão **Gerar capas**, em Painel → Materiais). PDFs cadastrados só por link do Google Drive precisam de uma imagem de capa escolhida em **Editar**, e destaca os campos preenchidos para você conferir. PDFs maiores: publique no Google Drive e cole o link (os dados lidos continuam preenchidos).
  - Os campos mudam conforme o tipo: **PDF** pede autor e páginas; **vídeo** pede link, professor/palestrante e duração; **áudio** pede link, autor/narrador e duração.
- **Publicações:** escolha a categoria:
  - **Estágio, Concurso, Emprego:** vagas e editais com prazo de inscrição.
  - **Atualização legislativa:** norma, data de publicação e link do texto oficial.
  - **Notícia:** título, fonte, tema, texto e link da matéria original.
  - **Entrevista:** vídeo ou áudio por link do YouTube ou do Google Drive, com nome e cargo do entrevistado.
- **Planos:** crie quantos quiser, com preço, dias de acesso, benefícios e um plano em destaque.
- **Configurações:** dias grátis, chave Pix e seu contato (WhatsApp/e-mail).

Para os alunos, as Notícias, as Entrevistas e as Atualizações da lei ficam juntas na aba **Notícias**.

**Leitura dos PDFs:** os alunos leem dentro do portal, com as páginas ajustadas à largura da tela (sem precisar de zoom), botões de zoom, **tela cheia** e **abrir em nova aba**. No app instalado no iPhone, esse botão vira **abrir em outro app** (Arquivos, Livros etc.). O portal lembra a página em que o aluno parou.

## Quiz e certificados
1. **Chave do Claude (uma vez):** crie uma chave em https://console.anthropic.com/settings/keys (o uso é cobrado pela Anthropic). No portal, vá em **Painel → Configurações → Inteligência artificial**, cole a chave, escolha o modelo (Sonnet 5.5 é o recomendado) e clique em **Testar conexão**. A chave fica só no seu navegador; ela não vai para o GitHub nem para os alunos. Em outro computador, cadastre de novo.
2. **Banco de questões sem custo de API (recomendado):** em **Painel → Materiais**, clique em **Questões** no PDF. No quadro **Importar banco de questões (HTML)**:
   - escolha a quantidade e o nível e clique em **Copiar prompt** (o prompt já vem com o título e a disciplina do material);
   - abra o Claude.ai (ou outro assistente), anexe o PDF, cole o prompt e envie;
   - baixe o arquivo .html que ele entregar (ou copie o código) e, no portal, escolha o arquivo ou cole o código e clique em **Ler questões**. O portal mostra quantas questões são válidas e por que alguma foi recusada; clique em **Acrescentar** ou **Substituir**;
   - para mais questões, peça "mais 20 questões diferentes das anteriores, no mesmo formato" e importe de novo, acrescentando.
   Revise as questões: você pode editar, excluir ou criar à mão, e baixar o banco em HTML como cópia de segurança.
   A geração direta pela API do Claude continua disponível, recolhida, como opção paga.
3. **Aluno:** em **Quiz e certificados**, escolhe a matéria e a quantidade de questões, responde dentro do portal e, ao final, vê a nota e a correção comentada.
4. **Certificado:** com acerto **acima de 60%** em um quiz de **pelo menos 10 questões**, o certificado em PDF é gerado na hora e guardado **somente no aparelho do aluno** (IndexedDB do navegador ou do app), sem ocupar espaço na nuvem. O aluno o abre quando quiser em **Quiz → Meus certificados**, no mesmo aparelho e navegador em que fez o quiz. Se limpar os dados do navegador ou desinstalar o app, o certificado é apagado; por isso, oriente os alunos a baixar o PDF. Os dois números são ajustáveis em Configurações.
5. **Notas:** em **Painel → Quiz e notas** ficam todas as tentativas (aluno, matéria, acertos, nota e o código do certificado), a média por matéria e a exportação em CSV. Na nuvem fica só esse registro de texto; o PDF do certificado nunca é enviado.

Atenção: como o portal não tem servidor, as respostas corretas ficam no Gist. Um aluno com conhecimento técnico consegue encontrá-las. O certificado é de aproveitamento no portal e informa que não substitui certificação oficial.

## Instituição e certificado
O portal é vinculado ao **Instituto Ágora de Estudos Jurídicos**, instituição de ensino livre que emite os certificados.
- **Painel → Instituição:** edite nome, sigla, lema, apresentação, cidade, CNPJ, texto legal e **quem assina** (nome completo e cargo). Clique em **Salvar**.
- **Assinatura:** escolha uma das opções.
  - **Manuscrita:** gerada a partir do nome, em letra cursiva.
  - **Desenhar:** assine com o dedo ou o mouse.
  - **Enviar foto:** assine num papel branco e fotografe; o fundo é removido.
- **Ver certificado de exemplo** mostra a prévia com os dados do formulário, antes de salvar.
- A marca aparece no certificado, na página inicial (seção **Quem certifica**), na tela de entrada, no menu lateral, em **Minha conta** e na página **A instituição** (`#/instituto`).
- **Aviso:** como curso livre, o certificado não depende de autorização do MEC e não equivale a diploma. Mantenha o texto legal do certificado e consulte um advogado se for formalizar a instituição (CNPJ, contrato social, CNAE de ensino).

## Colunistas e Coluna Acadêmica
Professores convidados escrevem artigos direto no portal, sem criar conta. O que publicam aparece para os alunos em **Coluna Acadêmica** (menu lateral), no bloco **Coluna Acadêmica** da tela inicial e na busca.

**Convidar um professor (1 minuto):**
1. Vá em **Painel → Colunistas → Novo colunista**.
2. Preencha o nome e, se quiser, e-mail, titulação, instituição, disciplina principal, minibiografia e foto. Clique em **Cadastrar e gerar link**.
3. O portal mostra o **link pessoal** do professor (termina em `#/escrever/...`). Envie pelo botão **WhatsApp** ou **E-mail**, ou copie.
   - **Guarde o link nesse momento.** Por segurança, o portal não armazena o link, só uma versão embaralhada dele. Se ele se perder, clique em **Novo link**: o anterior deixa de funcionar.

**O que o professor faz:**
1. Abre o link no computador ou no celular. O editor aparece direto, com o nome dele.
2. Escreve título, linha fina e texto, com negrito, itálico, intertítulos, citações, listas e links. Pode colar textos do Word ou do Google Docs (a formatação é limpa automaticamente).
3. O texto é **salvo sozinho**: na hora, no próprio aparelho, e na nuvem (Gist) a cada minuto, ao trocar de aba ou com **Ctrl+S**. O indicador no topo mostra "Tudo salvo na nuvem".
4. Clica em **Salvar e publicar na Coluna**. O artigo aparece para os alunos e o portal mostra o link do artigo para compartilhar com a turma.
5. Depois de publicado, **tudo o que ele alterar (texto, alinhamento, imagens) vai para a Coluna Acadêmica sozinho a cada salvamento**, em até meio minuto; o botão **Atualizar na Coluna agora** faz isso na hora. Se a alteração sair das regras (por exemplo, passar do limite de caracteres), o editor avisa e os alunos continuam vendo a versão anterior até ele corrigir. Ele também pode **Retirar da Coluna** (volta a ser rascunho) ou **Excluir**. Em **Meu perfil** ele troca a foto, a titulação e a minibiografia.
6. Rascunhos não aparecem para os alunos; só o que foi publicado.

**Recursos do editor:** negrito, itálico, sublinhado, tachado, marca-texto, sobrescrito e subscrito; intertítulo, subtítulo e citação; alinhar à esquerda, centralizar, alinhar à direita e **justificar**; listas; links; linha separadora; desfazer e refazer.
- **Imagens:** botão **Imagem** (ou arrastar/colar a imagem no texto). O professor escolhe o tamanho (pequena, média ou grande), a posição (centralizada, à esquerda ou à direita com o texto ao lado), a legenda e a descrição. Clicando na imagem aparece uma barra para mudar tamanho, posição, legenda ou remover. As imagens são reduzidas automaticamente (cerca de 50 a 300 KB cada) e guardadas no Gist em arquivos próprios (`img-....txt`); o texto guarda só a referência. Também é possível usar o endereço (https) de uma imagem da internet.
- A primeira imagem do artigo vira a **capa** do cartão na Coluna Acadêmica.
- No celular, o tamanho e a posição são mantidos de forma proporcional: imagens pequenas continuam ao lado do texto e as médias ocupam a maior parte da tela, alinhadas ao lado escolhido (não há espaço para texto ao lado de uma imagem média numa tela estreita).
- **Se um aluno ou professor ainda vir a versão antiga do portal** depois de você atualizar os arquivos, peça para recarregar a página (no app instalado, fechar e abrir de novo). O GitHub Pages pode levar até 10 minutos para entregar a nova versão.

**Regras dos artigos (Painel → Colunistas → Regras dos artigos):**
| Regra | Padrão | Observação |
|---|---|---|
| Mínimo de caracteres | 1.500 | cerca de 250 palavras |
| Máximo de caracteres | 12.000 | cerca de 2.000 palavras, até 10 min de leitura |
| Imagens por artigo | 6 | 0 = sem imagens |
| Tempo na Coluna | 90 dias | 0 = sem prazo |
| Aviso ao colunista | 7 dias antes | |

- Os caracteres são contados com espaços. O editor mostra o contador com uma barra (verde, dourada perto do limite e vermelha se passar), impede digitar além do máximo e só deixa publicar dentro dos limites. Se o professor colar um texto maior, ele é avisado de quantos caracteres precisa cortar.
- O professor vê as regras na lateral do editor (no celular, em **Meus textos**).
- O mínimo de caracteres vale para a **primeira publicação**. Num artigo já publicado, mudanças de formatação (justificar, centralizar, imagens) sempre vão para a Coluna Acadêmica; só fica bloqueada a alteração que deixa o texto **menor que a versão publicada e abaixo do mínimo**. Nesse caso aparece um aviso vermelho fixo no rodapé do editor.

**Prazo de cada artigo na Coluna Acadêmica:**
- Conta a partir da **primeira publicação**. Atualizar o texto, ou retirar e publicar de novo, **não reinicia** o prazo.
- Antes de publicar, o professor é informado da data em que o artigo sairá da Coluna Acadêmica. Depois, o editor mostra "Na Coluna Acadêmica até dd/mm (faltam X dias)" em cada artigo.
- Quando faltar o número de dias do aviso, aparece um **alerta no topo do editor** e na lista de textos; ao abrir o link, o professor também recebe um aviso. Artigos que já saíram aparecem como **Expirado**.
- Ao expirar, o artigo **sai da Coluna Acadêmica** automaticamente (não é apagado).
- Em **Painel → Colunistas → Artigos → Prazo**, você define a data de cada artigo, **prorroga** (+30, +60, +90 dias), deixa **sem prazo** ou volta ao prazo padrão. Ao prorrogar um artigo expirado, ele volta à Coluna Acadêmica.
- Mudar o tempo nas regras vale para as próximas publicações; os artigos já publicados mantêm a data que tinham.

**Para os alunos:** a Coluna Acadêmica mostra o artigo mais recente em destaque, os demais em cartões, filtro por disciplina, busca e a lista de colunistas. A página **atualiza sozinha a cada 30 segundos**: quando um professor publica, o artigo aparece sem recarregar (com um aviso). Os artigos seguem a mesma regra dos demais conteúdos: é preciso ter o acesso ativo.

**No Painel → Colunistas você também:**
- vê quantos artigos e rascunhos cada professor tem, a última escrita e as **leituras dos alunos**;
- em **Artigos**, lê e **oculta** um artigo da Coluna Acadêmica sem apagá-lo (só o professor edita o texto);
- **Pausa** o acesso (o link para de funcionar; os artigos já publicados continuam) e reativa quando quiser;
- **Exclui** o colunista (apaga também os artigos e rascunhos dele).

**Bom saber:**
- Cada professor tem um arquivo próprio no Gist (`coluna-....json`). Por isso dois professores escrevendo ao mesmo tempo não atrapalham um ao outro nem os dados do portal.
- Os textos aceitam imagens (JPG, PNG ou WebP), mas não outros arquivos anexados (use links).
- O link do professor funciona como uma senha. Peça que ele não o compartilhe. Se vazar, gere um novo.
- Como no restante da versão sem servidor, uma pessoa com conhecimento técnico consegue recuperar o token do GitHub e alterar textos. A conta do GitHub exclusiva para o portal continua sendo a proteção recomendada.


### Importar artigo do Word (.docx)

No editor, o colunista clica em **Importar do Word** e escolhe o arquivo .docx. O arquivo é lido no próprio navegador, e o portal configura o artigo sozinho:

- **título e linha fina**, pelo estilo "Título"/"Subtítulo" do Word ou pela primeira linha em destaque;
- **parágrafos justificados**, com a fonte e o espaçamento da Coluna Acadêmica (a fonte e as cores do Word são descartadas);
- **intertítulos**, pelos estilos "Título 1, 2, 3" ou por linhas curtas em negrito;
- **citações longas**, pelo estilo "Citação" ou por recuo grande, como na ABNT;
- negrito, itálico, sublinhado, sobrescrito, **listas**, **links**, **imagens** (com legenda quando começa por "Figura" ou "Fonte") e **notas de rodapé**, que vão para o fim do texto.

**Uma página no máximo:** por padrão, o artigo pode ter até 3.500 caracteres (cerca de 550 palavras, 3 minutos de leitura) e 1 imagem, para a leitura em tela não cansar. Se o arquivo passar disso, o colunista escolhe entre duas opções:

- **Ajustar para uma página:** mantém o texto do início, com parágrafos inteiros, e tira primeiro as notas.
- **Importar tudo e eu reduzo:** o excesso fica marcado em vermelho no editor, com a linha "Fim da página", e o artigo só é publicado quando couber.

O limite vale também para quem escreve direto no editor. Em **Painel → Colunistas → Regras dos artigos**, desmarque **Artigo de no máximo uma página** para voltar aos limites de caracteres e imagens escolhidos por você.

**Campos preenchidos sozinhos:** ao importar, o portal preenche o título, a linha fina, a **disciplina** (pelo assunto do texto, se o campo estiver vazio) e o corpo do artigo. Tudo pode ser editado depois.

**No celular e no tablet:** o editor ocupa a tela inteira, a barra de formatação desliza para o lado e tem botões maiores para o toque, e a barra de publicar fica compacta. Para importar do Word nessas telas, use o botão **Word** no topo, o aviso **Já tem o artigo pronto no Word?** que aparece num texto em branco ou a opção em **Meus textos**.

Arquivos no formato antigo (.doc) não são lidos: no Word, use "Salvar como" → "Documento do Word (.docx)".

## Divulgação: QR codes e cartões
Em **Painel → Configurações → Divulgação** há três QR codes, cada um com um cartão pronto para baixar, no visual do portal (azul, latão e o símbolo das colunas):

| QR | Para onde leva | Onde baixar |
|---|---|---|
| **Portal** | Página inicial do portal | Configurações → Divulgação → Portal |
| **Aluno** | Direto para a tela de cadastro do aluno | Configurações → Divulgação → Aluno (e no botão **Link para os alunos**) |
| **Professor colaborador** | Página **Seja colunista**: o professor faz o próprio cadastro e começa a escrever | Configurações → Divulgação → Professor colaborador |

**Como usar:**
1. Escolha Portal ou Aluno.
2. Escreva o **título**, a **mensagem** e o **selo de destaque** (o selo vermelho; deixe em branco para não mostrar). A prévia ao lado atualiza enquanto você digita.
   - O cartão **não mostra o endereço do site** (o QR code já leva ao portal). Se quiser, marque **Mostrar o endereço do site no cartão**. Endereços de teste, como `localhost`, nunca aparecem.
   - Os textos padrão são gerais, para qualquer estudante de Direito, sem citar faculdade específica.
3. Escolha o formato: **Quadrado** (1080 × 1080, WhatsApp e Instagram), **Vertical** (1080 × 1920, Status e Stories) ou **Cartaz A4** (2480 × 3508, para imprimir em 300 dpi).
4. Clique em **Baixar cartão (PNG)**. Para usar o código em outra arte, clique em **Baixar só o QR code** (1200 × 1200, fundo branco).
5. **Salvar mensagem** guarda o texto para as próximas vezes. **Voltar ao texto padrão** restaura a sugestão do portal.

**Professor colaborador (autocadastro):** o QR de convite é o mesmo para todos os professores. Quem lê o QR abre a página **Seja colunista**, preenche nome, e-mail, titulação, instituição, disciplina, minibiografia e foto (opcional), marca a declaração de autoria e clica em **Criar meu acesso e começar a escrever**. Na hora ele recebe o link pessoal (com botões para copiar, mandar para o próprio WhatsApp ou e-mail e baixar o QR do acesso) e entra direto no editor.
- **Cadastro de colunistas aberto:** desmarque para encerrar as inscrições. O QR passa a mostrar "Inscrições encerradas".
- **Exigir a minha aprovação antes de o professor publicar:** desligado, quem se cadastra já publica. Ligado, o professor escreve e salva normalmente, mas só publica depois que você clicar em **Aprovar** em Painel → Colunistas (aparece um aviso com os nomes). O editor dele libera o botão sozinho, sem recarregar.
- **Gerar novo código:** o QR e o link de cadastro anteriores deixam de funcionar (use se o QR circulou onde não devia). Quem já se cadastrou continua com o próprio acesso.
- Não é possível cadastrar dois colunistas com o mesmo e-mail. Quem perder o link pessoal pede um **Novo link** ao administrador.
- Você continua podendo cadastrar professores manualmente em **Colunistas → Novo colunista**; nesse caso o QR pessoal do professor aparece na hora, com o botão **Baixar cartão**.

Os QR codes usam correção de erro alta e o símbolo do portal no centro. Todos foram testados com leitor de QR nos três formatos.

**Vários QR codes numa folha A4 (para imprimir e economizar papel):** logo abaixo, em **Vários QR codes numa folha A4**:
1. Marque os QR codes que quer imprimir (**Portal**, **Aluno** e **Professor colaborador**; este último aparece depois que o convite é gerado na aba Professor colaborador) e informe quantas **cópias** de cada.
2. Escolha o **tamanho**:

| Opção | Por folha | Tamanho de cada um |
|---|---|---|
| Cartazes | 4 | cerca de 9,4 × 13,3 cm |
| Cartões | 9 | cerca de 6,2 × 8,8 cm |
| Quadrados grandes | 6 | cerca de 9,1 × 9,1 cm |
| Quadrados pequenos | 12 | cerca de 6,5 × 6,5 cm |
| Etiquetas só com o QR | 20 | cerca de 4,4 × 5,5 cm (boa para papel adesivo) |

3. Escolha o **estilo**: **Fundo claro** (padrão, gasta pouca tinta) ou **Azul do portal**. Deixe marcadas as **linhas de corte** para recortar cada cartão.
4. **Completar a folha** distribui as cópias para não sobrar espaço em branco. A prévia mostra a primeira folha e o resumo diz quantas folhas o PDF terá.
5. **Baixar PDF para imprimir**: o PDF tem quantas páginas forem necessárias (até 50). Na impressora, escolha papel A4 e **tamanho real (100%)**.

Os textos dos cartões são os mesmos da Divulgação (título, mensagem e selo de cada tipo). Os QR codes da folha foram testados com leitor de QR em todos os tamanhos.

## Instituições parceiras
Em **Painel → Instituições parceiras** você cadastra as instituições que apoiam o portal. As marcadas como exibidas aparecem:
- na **tela inicial do portal**, para visitantes (seção "Instituições parceiras", e numa faixa de logomarcas no celular);
- na tela **Início** dos alunos, no fim da página.

**Cadastrar:** clique em **Nova instituição**, escolha a **logomarca** (clique ou arraste; PNG com fundo transparente ou SVG ficam melhores, e JPG também funciona), informe o **nome**, o **site** (pode digitar sem "https://") e, se quiser, uma **descrição curta** (ex.: "Faculdade de Direito"). O cartão de cada instituição leva ao site dela, numa nova aba. Sem logomarca, aparecem as iniciais do nome.

**Organizar:** use ↑ e ↓ para definir a ordem, **Ocultar/Exibir** para tirar ou recolocar na tela inicial sem apagar, **Editar** para trocar a logomarca ou o site e a lixeira para excluir. A **Prévia na tela inicial**, abaixo da lista, mostra como a seção vai ficar.

A logomarca é ajustada automaticamente (até 600 × 300 px, mantendo a transparência) e guardada no Gist num arquivo próprio (`img-....txt`).


### Propostas de parceria (para visitar instituições)

Em **Painel → Propostas de parceria → Nova proposta**, preencha:

- a instituição (nome, sigla, cidade e logo, que é opcional);
- o destinatário e o cargo;
- a data, a validade e o número da proposta;
- o seu contato.

O texto da proposta vem pronto, em 9 partes: apresentação do portal, objetivo da parceria, o que o portal oferece à instituição, o que se propõe a ela, como funciona a validação dos certificados, benefícios para alunos e docentes, custos e compromissos, próximos passos e vigência. Cada parte pode ser editada, voltar ao texto do modelo ou ficar fora da proposta.

Em **Investimento da instituição (contrato mínimo de 1 ano)**, escolha como cobrar da instituição parceira:

- **por aluno ou docente com acesso**, por ano ou por mês; a proposta mostra quanto isso fica abaixo do plano anual individual;
- **valor fixo** para a instituição;
- **a combinar na reunião**.

Informe também o mínimo de acessos e a forma de pagamento. A sugestão inicial é 30% abaixo do plano anual individual, por aluno, por ano. Esses dados entram na parte **Custos e compromissos**, junto com os planos mensal, semestral e anual. A parte **Vigência** diz que o contrato vale por no mínimo 1 ano, com renovação automática.

A opção **Mostrar os números do portal** inclui no documento os números atuais: estudantes, cursos, materiais, colunistas e instituições parceiras. A pré-visualização ao lado mostra o documento enquanto você digita. Antes das assinaturas, a proposta traz dois **QR codes**: um abre o portal e o outro abre o cadastro de colunistas, para os docentes da instituição se cadastrarem e começarem a escrever. Se o cadastro de colunistas estiver fechado em Configurações, o editor avisa. Para tirar os QR codes, desmarque a opção. Se você estiver usando o portal no computador (endereço local), preencha **Endereço do portal** com o endereço publicado. **Baixar PDF** gera o arquivo A4 com a identidade visual do portal, com espaço para as assinaturas. **Duplicar** reaproveita a proposta para outra instituição.

As propostas ficam guardadas **só neste computador** e não vão para o Gist, porque têm nomes e contatos. Se trocar de computador, baixe o PDF antes.

Revise o texto antes de enviar, principalmente a parte de custos (planos mensal, semestral e anual, com os valores atuais cadastrados em Planos) e a de vigência: ele é um modelo e não substitui o termo de cooperação que as partes vão assinar.

## Cursos online
Os alunos encontram os cursos em **Cursos online** (menu lateral) e na tela **Início**. Você cadastra e configura tudo em **Painel → Cursos online**.

**Criar um curso:**
1. **Novo curso**: informe o título e a área. O curso nasce como **rascunho** (só você vê).
2. Na tela do curso, preencha os **Dados do curso**: capa (imagem), subtítulo, professor ou instrutor, **carga horária** (vai no certificado; em branco, soma a duração das aulas), **nota mínima** (padrão 60: o aluno precisa de nota **acima** de 60%), **quem pode fazer** (todos os alunos cadastrados ou só assinantes) e a descrição. Clique em **Salvar dados do curso**.
3. **Aulas**:
   - **Vídeo do YouTube**: cole o link (youtube.com/watch, youtu.be ou shorts). O vídeo pode ser público ou **não listado**. A miniatura aparece para confirmar.
   - **Material em PDF**: envie o arquivo. O aluno lê no leitor do portal.
   - Use **Módulo** para agrupar as aulas (ex.: "Módulo 1: Introdução") e ↑ ↓ para ordenar. Informe a duração em minutos.
4. **Avaliação final** (questões de múltipla escolha com explicação):
   - **Gerar com IA**: a IA lê os PDFs do curso e elabora as questões (precisa da chave da IA em Configurações). Revise antes de publicar.
   - **Importar da biblioteca**: copia as questões já geradas para um material.
   - **Adicionar questão**: escreva o enunciado, de 4 a 5 alternativas, marque a correta e a explicação.
   - Sem questões, o certificado é liberado só pela conclusão das aulas.
5. **Publicar curso**. Para tirar do ar sem apagar, use **Voltar para rascunho**.

**Para o aluno:** escolhe o curso, clica em **Inscrever-se e começar** e entra na sala de aula, com a lista de aulas e o progresso. A videoaula é marcada como concluída quando o vídeo termina (ou pelo botão **Concluir aula**). Depois de concluir todas as aulas, a **avaliação final** é liberada; ele pode refazer quantas vezes quiser. Com nota acima da mínima, clica em **Baixar certificado (PDF)**. O certificado sai no modelo da instituição, com o nome do curso, a carga horária, a nota e o código de verificação, e pode ser baixado de novo a qualquer momento na página do curso.

**Cadastro rápido com IA:** em **Painel → Cursos online → Cadastro rápido com IA**:
1. Escreva o tema, o público, o número de aulas e de questões (e, se quiser, a carga horária e orientações). Clique em **Copiar prompt**.
2. Cole o prompt numa IA **com busca na web ativada** (por exemplo, o Claude com pesquisa). Ela devolve o curso em JSON, com vídeos reais do YouTube, descrições e a avaliação final.
3. Clique em **Já tenho a resposta**, cole a resposta inteira e clique em **Conferir os vídeos**. O portal verifica no YouTube se cada link existe: os que não existem (vídeo removido ou link inventado pela IA) ficam de fora, e as questões incompletas são descartadas.
4. **Criar curso como rascunho**. Assista aos vídeos, revise as questões, complete o que faltar e publique.

**Importar um arquivo JSON com o curso pronto:** em **Painel → Cursos online → Importar arquivo JSON**, escolha (ou arraste) o arquivo `.json`. Ele pode vir de um assistente de IA (use o prompt do **Cadastro rápido com IA**, que pede o arquivo `curso.json`), de outro portal ou de um curso exportado. O portal confere os vídeos e cria o curso como rascunho, com as aulas, a avaliação, a nota mínima e quem pode fazer. **Baixar modelo de arquivo** mostra o formato. Aulas em PDF não vão dentro do arquivo: anexe os PDFs no editor depois de importar.

**Exportar:** no editor de um curso, **Exportar JSON** baixa o curso inteiro (dados, aulas e questões) para backup ou para importar em outro portal.

**Acompanhamento:** na lista de cursos aparecem inscritos, concluintes e certificados. Dentro de cada curso, **Alunos inscritos** mostra o progresso, a melhor nota e o código do certificado de cada aluno.


### Compartilhar um curso

Há um botão **Compartilhar** em três lugares: na página do curso, no ícone sobre a capa em **Cursos online** e na lista de **Painel → Cursos**. Ele abre:

- o link do curso, com o botão **Copiar link**;
- uma mensagem pronta, que você pode editar;
- **Enviar pelo WhatsApp**, que abre o WhatsApp com a mensagem e o link;
- **Copiar mensagem**;
- no celular, **Outros apps**.

Quem abre o link sem conta vê a página do curso (capa, descrição e lista de aulas) com os botões **Criar conta e fazer o curso** e **Já tenho conta**. Depois de criar a conta ou entrar, a pessoa volta direto para o curso e se inscreve. Compartilhe só cursos publicados: rascunhos só abrem para o administrador.

### Duração e ordem das videoaulas

O prompt pede vídeos com duração média de **30 minutos** (entre 20 e 40). Para mudar, use o campo **Duração média de cada videoaula** (15, 20, 30, 45 ou 60 minutos).

As aulas vêm sempre na **sequência cronológica do conteúdo**: fundamentos primeiro, depois cada etapa na ordem da lei ou do processo, e por fim os temas especiais. Cada aula parte da anterior, e as séries de um mesmo canal seguem a ordem dos episódios.

### Capa do curso

O prompt também pede à IA a **capa do curso**, coerente com a matéria. A IA define:

- o conceito visual;
- as cores, sóbrias e combinando com o assunto;
- uma frase curta;
- uma ilustração vetorial original, sem texto, logotipos ou brasões.

Ao importar, o portal monta a capa (1280×720) com o título, a área e o nome do portal. Assim todas as capas seguem o mesmo padrão. Se a ilustração não vier, ou vier com problema, o portal usa um símbolo da matéria (balança, algemas, folha, globo, etc.). Curso sem capa gravada (por exemplo, importado antes desta versão) aparece com uma capa padrão desenhada na hora. Em **Painel → Cursos**, o botão **Gerar capas que faltam** grava as capas de uma vez. No editor do curso, o botão **Gerar capa** cria outra capa (escolhendo símbolo, cores e frase), e **Trocar capa** envia uma imagem pronta.

### Apostilas em PDF geradas com o curso

No **Cadastro rápido de curso**, escolha em **Material em PDF** uma apostila por módulo, uma apostila para o curso todo ou nenhuma. Em **Tamanho**, escolha curta (2 a 3 páginas), média (4 a 6) ou completa (8 a 10). O prompt pede à IA o texto original de cada apostila, com:

- base legal citada com número da lei e artigo;
- caso prático;
- pontos-chave;
- perguntas para revisar.

O prompt também proíbe inventar súmulas, julgados ou artigos.

Ao importar o curso.json, o portal transforma cada apostila num **PDF A4 com a identidade do portal** (faixa com o nome do portal, título, módulo, numeração de páginas e nota sobre a legislação). Na tela **Conferir e criar**, use **Ver PDF** para ler antes. Cada apostila entra como aula em PDF no fim do seu módulo. Leia as apostilas e confira as leis citadas antes de publicar o curso.

## Sorteios

Em **Painel → Sorteios → Novo sorteio**, informe o prêmio, a data e a hora, a foto (opcional), o regulamento e quem concorre:

- **Todos os usuários cadastrados**;
- **Usuários com acesso ativo** (inclui o período grátis);
- **Assinantes pagantes** (qualquer plano);
- **Assinantes do plano anual**.

Também dá para limitar a quem se cadastrou até uma data, escolher o número de ganhadores e deixar de fora quem já ganhou antes. Administradores nunca participam, e a assinatura precisa estar ativa no momento do sorteio.

O sorteio aparece na tela inicial (computador e celular) e no Início do aluno, com um relógio contando dias, horas, minutos e segundos. Cada aluno vê se está participando ou o que falta (por exemplo, assinar o plano anual).

**Prêmio em assinatura:** em **Tipo de prêmio**, escolha "Assinatura do portal" e o plano (mensal, semestral, anual ou outro que você cadastrou). Quando o sorteio for realizado, o portal libera o plano automaticamente para cada ganhador e suplente. Se o ganhador já tiver acesso, os dias do prêmio são somados ao que ele tem. A assinatura fica marcada como "prêmio" e não entra na conta dos assinantes pagantes. O ganhador vê na tela inicial até quando o acesso está liberado. Se a liberação falhar (por exemplo, sem internet), o botão **Liberar agora** aparece ao lado do nome do ganhador.

Na hora marcada, clique em **Realizar sorteio**. O portal sorteia de forma aleatória entre quem atende aos critérios naquele momento. Em **Participantes**, veja e baixe a lista (CSV). O resultado fica na tela inicial por 10 dias, só com o nome abreviado (ex.: "Ana S."). Os contatos completos aparecem apenas para você no painel. Se o ganhador não responder, use **Sortear suplente**.

## Cursos: a sala de aula

- **Continuar de onde parou (só vídeos):** o portal guarda o ponto do último vídeo assistido. Ao voltar ao curso, abre esse vídeo no ponto em que o aluno parou, com a opção **Assistir do início**. Abrir um PDF não muda esse ponto. Se o último vídeo já terminou, o curso abre na próxima aula pendente, na ordem do curso.
- **Material de apoio sem parar o vídeo:** abaixo do vídeo, a aba **Material de apoio** lista os PDFs do módulo e os demais do curso. Ao clicar, o PDF abre ao lado (no celular, por cima) e o vídeo continua tocando. O aluno pode **Marcar como lido**, o que conta no progresso. Os PDFs também aparecem na lista de aulas, na ordem do curso. Clicar neles também abre o material ao lado, sem trocar o vídeo. O centro da sala de aula é sempre um vídeo: **Anterior** e **Próxima aula** andam entre os vídeos, e um link antigo que aponte para um PDF abre o vídeo daquela parte com o PDF ao lado.
- **Próximo passo:** quando o vídeo termina, a aula é concluída e aparece o que fazer a seguir: a próxima aula, o material do módulo que ainda não foi lido, a avaliação final ou o certificado.
- **Minhas anotações:** cada curso tem um bloco de notas na aba **Minhas anotações**. Ele salva sozinho enquanto o aluno digita, e **Marcar a aula** insere o nome da aula e o minuto do vídeo. As anotações ficam só no navegador do aparelho (IndexedDB) e **não vão para a nuvem**, nem para o Gist. Para levar a outro aparelho, use **Baixar (.txt)**. Limpar os dados do navegador apaga as anotações.

## Leitura protegida e análises
- **Sem download:** os PDFs são lidos somente dentro do portal, no leitor próprio. Não há botão de baixar, abrir em outra aba ou compartilhar, o clique com o botão direito fica bloqueado, e Ctrl+S e Ctrl+P não salvam nem imprimem o material. Vídeos e áudios enviados também não mostram a opção de download.
- **PDFs do Google Drive:** o portal tampa o botão de abrir fora do visualizador, mas o Drive tem opções próprias. No Drive, em **Compartilhar → ⚙ (Configurações)**, desmarque **Leitores e comentaristas podem ver a opção de baixar, imprimir e copiar**. O mais seguro é enviar o PDF como arquivo pelo painel.
- **Limite honesto:** nenhum site consegue impedir totalmente a cópia (capturas de tela, por exemplo), e numa versão sem servidor um aluno com conhecimento técnico ainda consegue chegar ao arquivo guardado no Gist. As medidas acima impedem o download fácil, que é o que a maioria faria.
- **Painel → Análises** (primeira aba): alunos cadastrados e novos, acesso ativo (pagantes e em teste), acessos ao portal por dia, novos cadastros por dia, materiais mais acessados, disciplinas mais estudadas, notícias e vagas mais lidas, aparelhos usados, assinantes por plano, conversão para plano pago, receita estimada e alunos mais ativos. Filtre por 7, 30 ou 90 dias e exporte a lista de alunos em **CSV** (abre no Excel).
- O uso de cada aluno é enviado em lotes (a cada 10 minutos ou quando ele fecha o portal), por isso os números podem levar alguns minutos para aparecer. Os acessos do administrador não são contados.

## Atualização automática das leis
O portal publica sozinho, em **Atualizações da lei**, as normas federais novas (leis ordinárias, leis complementares, emendas constitucionais e medidas provisórias; decretos são opcionais). A fonte é a base oficial de normas jurídicas dos **Dados Abertos do Senado Federal**. Cada norma vira uma publicação com o número, a data, a ementa, a disciplina provável e o link para o texto oficial, marcada como **Fonte oficial**.

**Ativar (uma única vez, 3 minutos):**
1. No repositório do site, envie também o arquivo `leis-sync.mjs` e a pasta `scripts` (arraste junto com os outros arquivos).
2. A pasta `.github` costuma não subir ao arrastar, porque começa com ponto. Crie o arquivo pelo próprio GitHub:
   - Clique em **Add file → Create new file**.
   - No nome, digite exatamente `.github/workflows/sincronizar-leis.yml`. O GitHub cria as pastas sozinho.
   - Abra o arquivo `sincronizar-leis.yml` que veio no pacote (pasta `.github/workflows`), copie todo o texto e cole. Clique em **Commit changes**.
3. Abra a aba **Actions** do repositório. Se aparecer um aviso, clique em **I understand my workflows, go ahead and enable them**.
4. Clique em **Sincronizar leis → Run workflow → Run workflow** para a primeira sincronização. Em 1 a 2 minutos, as normas dos últimos 30 dias aparecem no portal.

**Como funciona depois:**
- O GitHub verifica o Senado **a cada hora**, sozinho, mesmo com o computador desligado. Não há custo em repositório público.
- No **Painel → Publicações**, o quadro **Atualização automática das leis** mostra a última verificação, quantas normas são novas e eventuais avisos.
- **Sincronizar agora** tenta consultar o Senado direto do navegador. Se o portal do Senado bloquear esse acesso, o painel mostra o atalho para rodar a sincronização no GitHub (um clique em **Run workflow**).
- **Configurar**: escolha os tipos de norma, a data a partir da qual publicar e se quer ignorar leis comemorativas (nomes de rodovias, datas comemorativas, créditos no orçamento).
- Você pode **editar** qualquer publicação automática (por exemplo, para comentar o que mudou). Se **excluir**, ela não volta nas próximas sincronizações.
- A sincronização usa o mesmo token que você salvou na configuração do portal, guardado no Gist. Não é preciso criar nada além do arquivo acima. (Opcional: se preferir, crie em **Settings → Secrets and variables → Actions** o segredo `GIST_TOKEN` com o token, e ele passa a ser usado no lugar.)

**Limites:**
- Não é tempo real no sentido de segundos: a verificação é de hora em hora, e a base do Senado costuma registrar a norma no mesmo dia ou no dia seguinte à publicação no Diário Oficial.
- O GitHub pausa tarefas agendadas de repositórios sem nenhuma alteração por 60 dias. Se isso acontecer, ele avisa por e-mail; basta clicar em **Enable workflow** na aba Actions.
- A disciplina é sugerida por palavras da ementa e pode errar. Revise quando for relevante para as aulas.

## Passo 4: enviar aos alunos
Clique em **Link para os alunos** no painel e envie pelo WhatsApp ou e-mail.
No celular, o aluno pode instalar o portal como aplicativo:
- **Android:** botão "Instalar" que aparece no próprio portal.
- **iPhone:** Compartilhar → Adicionar à Tela de Início.

**Link mais curto (recomendado):** no painel, em *Link para os alunos → Deixar o link mais curto*, copie a linha `gist: { user: '...', id: '...' },`.
No repositório, abra `index.html`, clique no lápis (editar), procure `gist: { user: '', id: '' },`, substitua pela linha copiada e faça **Commit**.
Assim o link vira só `https://SEU-USUARIO.github.io/agora-juridica/`, e o app instalado no iPhone sempre encontra o conteúdo.

## Passo 5: depois do mês grátis
1. O aluno paga (Pix ou o link de pagamento que você configurar) e envia o comprovante.
2. Em **Painel → Códigos de acesso → Gerar código**, escolha o plano que o aluno pagou (os dias são preenchidos automaticamente) e a data limite de uso.
3. Copie o código (ex.: `AJ-7K3P-Q9XD`) e envie ao aluno. Ele digita em **Assinatura** e o acesso é renovado.

Um código pode valer para um aluno ou para a turma toda (ex.: "Turma 3º período, dezembro"). Cada aluno usa cada código só uma vez.

---

## Contas dos alunos
- Cada aluno se cadastra uma vez e entra com o mesmo e-mail e senha em qualquer aparelho. O mesmo e-mail não pode se cadastrar duas vezes.
- Em **Painel → Alunos** você vê todos os cadastros, libera dias, cancela acessos e **redefine senhas** (quando alguém esquecer). O aluno troca a senha em **Minha conta**.
- As senhas são guardadas embaralhadas (PBKDF2), nunca em texto puro.

## Riscos desta versão (GitHub, sem servidor)
- **O token do GitHub fica dentro do portal.** Ele é guardado embaralhado, mas uma pessoa com conhecimento técnico consegue recuperá-lo e alterar ou apagar os dados do portal, inclusive dar acesso grátis a si mesma ou se tornar administradora. Por isso, use uma conta do GitHub exclusiva para o portal e guarde cópias dos Gists.
- **Os cadastros (nome, e-mail e telefone) ficam num Gist secreto** que pode ser lido por quem descobrir o endereço. Peça só os dados necessários e informe os alunos (LGPD).
- O painel lista até 300 alunos.
- **O controle de acesso é feito no navegador.** Basta para uma turma, mas alguém com conhecimento técnico consegue abrir os arquivos do Gist sem pagar. Para cobrança séria em escala, use o modo **Firebase** (README.md), que bloqueia de verdade no servidor.
- O Gist é **secreto**: não aparece em buscas, mas quem tiver o endereço consegue ler. Não publique dados pessoais nele.
- Arquivos de até 4 MB por envio. Vídeos e arquivos grandes devem ser links (YouTube ou Google Drive).

## Menu lateral e rotação da tela

- **Tablets e celulares:** o menu lateral fica oculto. O botão ☰ no canto superior esquerdo abre o menu por cima do conteúdo. Ele se fecha ao tocar fora, ao escolher um item ou pelo mesmo botão. No tablet deitado, a tela funciona como no computador, com o botão para ocultar ou mostrar o menu.
- **Ocultar o menu (computador):** no topo de qualquer página, o botão ☰ oculta o menu lateral e dá mais espaço ao conteúdo, como o vídeo das aulas. Clique de novo para mostrar. A escolha fica guardada no aparelho.
- **Girar o celular ou tablet:** a tela se ajusta sem recarregar a página, e o vídeo continua tocando. O app instalado também pode ser usado na horizontal.

