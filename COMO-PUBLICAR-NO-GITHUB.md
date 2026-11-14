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

## Passo 2: conectar o portal ao Gist (2 minutos)
1. Abra o endereço do site. Vai aparecer **"Portal ainda não configurado"**. Clique em **Configurar com o GitHub**.
2. Clique no link **GitHub → Novo token (classic)**. A permissão **gist** já vem marcada.
   Escolha a validade (ex.: 90 dias), clique em **Generate token** e copie o código `ghp_...`.
3. Cole o token no portal e clique em **Criar portal**.
4. Pronto: o portal cria o Gist e mostra o **link para os alunos** (com botão de WhatsApp).

> O token fica salvo **só no seu navegador** e nunca vai para o Gist nem para os alunos.
> Em outro computador, clique em **Entrar → Sou o administrador** e cole o token de novo.
> Quando o token vencer, gere outro do mesmo jeito.

## Passo 3: publicar conteúdo
No **Painel administrativo**:
- **Materiais:**
  - **PDF e áudio:** envie direto (até 4 MB por arquivo; ficam guardados no Gist).
  - **Vídeos:** suba no YouTube (pode ser "não listado") ou no Google Drive e cole o link.
- **Publicações:** estágios, concursos, empregos e atualizações da lei.
- **Planos:** crie quantos quiser (ex.: Mensal, Semestral, Anual, Reta final OAB), com preço, dias de acesso, benefícios e um plano em destaque com o selo "Mais escolhido".
- **Configurações:** dias grátis, chave Pix e seu contato (WhatsApp/e-mail).

As mudanças aparecem para os alunos em **até 5 minutos**, por causa do cache do GitHub.

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

## Limites desta versão (GitHub, sem servidor)
- **A conta do aluno fica no aparelho dele.** Se ele trocar de celular ou limpar os dados do navegador, cria a conta de novo. Também não existe, no painel, uma lista dos alunos cadastrados.
- **O controle de acesso é feito no navegador.** Basta para uma turma, mas alguém com conhecimento técnico consegue abrir os arquivos do Gist sem pagar. Para cobrança séria em escala, use o modo **Firebase** (README.md), que bloqueia de verdade no servidor.
- O Gist é **secreto**: não aparece em buscas, mas quem tiver o endereço consegue ler. Não publique dados pessoais nele.
- Arquivos de até 4 MB por envio. Vídeos e arquivos grandes devem ser links (YouTube ou Google Drive).
