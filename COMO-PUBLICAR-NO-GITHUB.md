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

## Colunistas e Painel colaborativo acadêmico
Professores convidados escrevem artigos direto no portal, sem criar conta. O que publicam aparece para os alunos em **Painel acadêmico** (menu lateral), no bloco **Painel colaborativo acadêmico** da tela inicial e na busca.

**Convidar um professor (1 minuto):**
1. Vá em **Painel → Colunistas → Novo colunista**.
2. Preencha o nome e, se quiser, e-mail, titulação, instituição, disciplina principal, minibiografia e foto. Clique em **Cadastrar e gerar link**.
3. O portal mostra o **link pessoal** do professor (termina em `#/escrever/...`). Envie pelo botão **WhatsApp** ou **E-mail**, ou copie.
   - **Guarde o link nesse momento.** Por segurança, o portal não armazena o link, só uma versão embaralhada dele. Se ele se perder, clique em **Novo link**: o anterior deixa de funcionar.

**O que o professor faz:**
1. Abre o link no computador ou no celular. O editor aparece direto, com o nome dele.
2. Escreve título, linha fina e texto, com negrito, itálico, intertítulos, citações, listas e links. Pode colar textos do Word ou do Google Docs (a formatação é limpa automaticamente).
3. O texto é **salvo sozinho**: na hora, no próprio aparelho, e na nuvem (Gist) a cada minuto, ao trocar de aba ou com **Ctrl+S**. O indicador no topo mostra "Tudo salvo na nuvem".
4. Clica em **Salvar e publicar no painel**. O artigo aparece para os alunos e o portal mostra o link do artigo para compartilhar com a turma.
5. Depois de publicado, ele pode editar e clicar em **Salvar e atualizar no painel**, **Retirar do painel** (volta a ser rascunho) ou **Excluir**. Em **Meu perfil** ele troca a foto, a titulação e a minibiografia.
6. Rascunhos não aparecem para os alunos; só o que foi publicado.

**Para os alunos:** o Painel acadêmico mostra o artigo mais recente em destaque, os demais em cartões, filtro por disciplina, busca e a lista de colunistas. A página **atualiza sozinha a cada 30 segundos**: quando um professor publica, o artigo aparece sem recarregar (com um aviso). Os artigos seguem a mesma regra dos demais conteúdos: é preciso ter o acesso ativo.

**No Painel → Colunistas você também:**
- vê quantos artigos e rascunhos cada professor tem, a última escrita e as **leituras dos alunos**;
- em **Artigos**, lê e **oculta** um artigo do painel sem apagá-lo (só o professor edita o texto);
- **Pausa** o acesso (o link para de funcionar; os artigos já publicados continuam) e reativa quando quiser;
- **Exclui** o colunista (apaga também os artigos e rascunhos dele).

**Bom saber:**
- Cada professor tem um arquivo próprio no Gist (`coluna-....json`). Por isso dois professores escrevendo ao mesmo tempo não atrapalham um ao outro nem os dados do portal.
- Os textos não aceitam imagens nem arquivos anexados (use links).
- O link do professor funciona como uma senha. Peça que ele não o compartilhe. Se vazar, gere um novo.
- Como no restante da versão sem servidor, uma pessoa com conhecimento técnico consegue recuperar o token do GitHub e alterar textos. A conta do GitHub exclusiva para o portal continua sendo a proteção recomendada.

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
