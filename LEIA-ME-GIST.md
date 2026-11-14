# Testar o Ágora Jurídica com colegas via GitHub Gist

## 1. Criar o Gist (2 minutos)
1. Acesse https://gist.github.com, já logado no GitHub.
2. Arraste **todos os arquivos desta pasta** para a página: `index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg`, `icon-maskable.svg`. Este LEIA-ME é opcional.
3. Clique em **Create public gist**. O gist secreto também funciona: quem tiver o link acessa.

## 2. Gerar o link que abre como site
O link "Raw" do Gist abre como texto, não como página. Para virar site:
1. No Gist, abra `index.html` e clique em **Raw**. Copie o endereço (algo como `https://gist.githubusercontent.com/SEU-USUARIO/ID/raw/.../index.html`).
2. Cole em https://raw.githack.com e copie o link gerado em **Development**.
   Dica: apague o trecho do código da versão (o hash entre `/raw/` e `/index.html`) para o link sempre abrir a versão mais nova.
3. Mande esse link para a turma. Na primeira visita, o githack mostra uma tela de confirmação. É só continuar.

No celular, abra o link e use **Adicionar à tela inicial** (Android: menu ⋮ → Instalar app; iPhone: Compartilhar → Adicionar à Tela de Início). O portal passa a abrir em tela cheia, como aplicativo.

## 3. Importante: dados compartilhados ou separados?

**Como está (modo local, IndexedDB):** cada colega tem um portal próprio, salvo no próprio navegador. Todos conseguem testar tudo: telas, cadastro, assinatura, envio de materiais e o administrador (`admin@agora.local` / `admin123`). Mas um não vê o que o outro publicou.

**Para a turma usar o mesmo portal (dados compartilhados):**
1. Crie o projeto no Firebase (passo 2.1 do README principal) e publique as regras (`firestore.rules` e `storage.rules`) pelo console ou pela CLI.
2. No Firebase → Authentication → Configurações → **Domínios autorizados**, adicione `raw.githack.com`.
3. Edite o `index.html` do Gist: em `CONFIG`, troque `backend: 'local'` por `'firebase'` e cole suas credenciais.
4. Cadastre-se no portal e, no console do Firestore, mude seu `role` para `admin`.

Pronto: o que você publicar aparece para todos os colegas assinantes.
