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
3. Arraste **todo o conteúdo da pasta `public`**: `index.html`, `manifest.webmanifest`, `sw.js` e a pasta `icons`. Clique em **Commit changes**.
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
  - **PDFs:** escolha ou arraste o arquivo (até 4 MB). O portal lê sozinho o **título/tema, o autor e o número de páginas**, preenche a **descrição com o subtítulo** do PDF e sugere a **disciplina**, e destaca os campos preenchidos para você conferir. PDFs maiores: publique no Google Drive e cole o link (os dados lidos continuam preenchidos).
  - Os campos mudam conforme o tipo: **PDF** pede autor e páginas; **vídeo** pede link, professor/palestrante e duração; **áudio** pede link, autor/narrador e duração.
- **Publicações:** escolha a categoria:
  - **Estágio, Concurso, Emprego:** vagas e editais com prazo de inscrição.
  - **Atualização legislativa:** norma, data de publicação e link do texto oficial.
  - **Notícia:** título, fonte, tema, texto e link da matéria original.
  - **Entrevista:** vídeo ou áudio por link do YouTube ou do Google Drive, com nome e cargo do entrevistado.
- **Planos:** crie quantos quiser, com preço, dias de acesso, benefícios e um plano em destaque.
- **Configurações:** dias grátis, chave Pix e seu contato (WhatsApp/e-mail).

Para os alunos, as Notícias, as Entrevistas e as Atualizações da lei ficam juntas na aba **Notícias**.

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
