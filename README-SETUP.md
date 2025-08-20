# Loja Fashion — Starter (Next.js + Supabase + Mercado Pago + Resend)

Este pacote entrega uma base **pronta** com:

- Vitrine (home), página de produto, carrinho
- Pagamento com **Mercado Pago (Checkout Pro)** e retorno automático
- **E-mail de confirmação** de pedido (Resend)
- **Painel Admin** (login + cadastro de produtos + pedidos)
- Upload de imagens no **Supabase Storage**
- Estilo dark minimalista (Tailwind)

## 1) Crie as contas (10 minutos)

- **GitHub**: para versionar o código.
- **Vercel**: para hospedar (login com GitHub).
- **Supabase**: https://supabase.com — crie um projeto.
- **Mercado Pago**: https://www.mercadopago.com.br/developers/panel — gere **Access Token** (use *Test* primeiro).
- **Resend**: https://resend.com — pegue a **API Key** (pode usar `onboarding@resend.dev` como remetente no começo).

## 2) Supabase — Banco, Storage e Policies

1. No **Supabase**, vá em **SQL Editor** → cole e rode o conteúdo do arquivo `supabase_schema.sql`.
2. Vá em **Authentication** → **Users** → **Create user** e crie **um usuário admin** (email = o que você vai colocar em `ADMIN_EMAIL`).
   - Defina uma senha para conseguir logar no painel.
3. Vá em **Storage** → **Create bucket** e crie um bucket **público** chamado `product-images`.
4. Vá em **Project Settings** → **Database** → **Parameters** → **Add** e crie a variável:
   - `app.admin_email` com valor `seu-email-admin@exemplo.com` (o mesmo do `ADMIN_EMAIL`).
   - Clique **Save** e depois **Restart** (se pedir).

Pegue em **Project Settings → API**:
- **Project URL** = `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** = `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** = `SUPABASE_SERVICE_ROLE`

## 3) Mercado Pago — Credenciais e URLs

No **Painel de Desenvolvedor** do Mercado Pago:
- Em **Credentials**, copie **Access Token (TEST)** → `MP_ACCESS_TOKEN`
- Em **Checkout Pro** → configure `back_urls` depois do deploy (ou use local via `.env`).
  - O projeto já manda `success` para `/pedido/sucesso` e passa `email` do cliente na URL.

> Dica: para testes, use os **cartões de teste** do Mercado Pago.

## 4) Resend — E-mails

- Pegue seu **RESEND_API_KEY** e coloque no `.env`.
- No começo, o remetente é `onboarding@resend.dev`. Depois, verifique seu domínio para usar `noreply@sua-loja.com`.

## 5) Configurar projeto local

1. Baixe o ZIP, extraia e entre na pasta pelo terminal.
2. Crie o arquivo `.env.local` copiando de `.env.example` e preenchendo **todas** as variáveis.
3. Instale e rode:
   ```bash
   npm install
   npm run dev
   ```
4. Acesse **http://localhost:3000** — use `/admin/login` para entrar com o admin criado no Supabase.

## 6) Deploy na Vercel (GUI, mais simples)

1. Crie um repositório **público ou privado** no GitHub e suba os arquivos.
2. Na **Vercel**, clique **Add New → Project** → **Import** seu repositório.
3. Em **Environment Variables**, adicione **todas** as variáveis do `.env` (iguais).
4. Clique **Deploy**.
5. Depois do deploy, ajuste em **NEXT_PUBLIC_SITE_URL** a URL pública (ex: `https://sualoja.vercel.app`) e redeploy.

## 7) Como funciona o fluxo de compra

- Cliente adiciona produtos ao carrinho.
- Informa **e-mail** no carrinho.
- Clica **Pagar com Mercado Pago** → criamos uma *Preference* e redirecionamos.
- Ao aprovar, o Mercado Pago volta para `/pedido/sucesso?...payment_id=...`.
- O front chama `/api/confirm` → nós **validamos** no MP, **registramos o pedido** no Supabase e **enviamos** o e-mail pelo Resend.
- O carrinho é limpo e mostramos o código do pedido.

## 8) Onde editar logos, WhatsApp e Instagram

- `NEXT_PUBLIC_STORE_NAME` no `.env`
- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_WHATSAPP_PHONE` (somente números, com DDI, ex: 55 41 99999-9999 → `5541999999999`)
- `NEXT_PUBLIC_WHATSAPP_MESSAGE` (URL-encoded)

## 9) Painel Admin — atalhos

- `/admin/login` → faça login com **ADMIN_EMAIL** e senha do usuário criado no Supabase.
- `/admin/produtos` → cadastrar/editar (a demo ***só exclui***, edições futuras fáceis de adicionar).
- `/admin/pedidos` → lista de pedidos pagos.

## 10) Próximos upgrades (depois que estiver rodando)

- Webhook do Mercado Pago para redundância (status assíncronos).
- Variações por tamanho/cor (tabela `product_variants`).
- Cupom de desconto.
- Frete e endereço (CEP via APIs).
- Nota fiscal e integração Correios.

---

**Suporte rápido**: Se der qualquer erro, confira as variáveis do `.env` na Vercel e no local. 90% dos bugs iniciais são credenciais faltando.
