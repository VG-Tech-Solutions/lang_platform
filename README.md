# 🌍 Sistema Web para Prática de Idiomas

Este projeto tem como objetivo desenvolver um **web app educativo** para prática de múltiplos idiomas com foco em escuta, leitura e compreensão. O sistema será moderno, responsivo e contará com autenticação via Google, assinatura via Stripe e um player avançado de áudios e textos.

---

## 📚 Visão Geral

O sistema permite que os usuários:

- Se autentiquem com Google.
- Selecione seu idioma nativo.
- Escolha um idioma que deseja aprender.
- Acesse lições com conteúdos em áudio e texto.
- Utilize um player com funcionalidades de repetição, gravação e tradução.
- Adquiram uma assinatura premium para liberar mais conteúdos.

---

## 🛠️ Stack Tecnológica

- **Frontend:** (definido separadamente)
- **Backend:** Node.js + Express ou Fastify
- **Banco de Dados:** Supabase (PostgreSQL + Auth + Storage)
- **Autenticação:** Supabase Auth (Login via Google)
- **Pagamentos:** Stripe (Checkout, Portal de Gerenciamento, Webhooks)
- **Hospedagem:** Hostinger (Frontend)

---

## 🔐 Níveis de Acesso

| Tipo de Acesso | lesson_access |
|----------------|---------------|
| Visitante      | 1             |
| Usuário Logado | 1, 2          |
| Premium        | 1, 2, 3       |

---

## 🧱 Estrutura de Tabelas (Supabase)

### `users`
| Campo                | Tipo       | Descrição                          |
|----------------------|------------|------------------------------------|
| id                   | UUID       | ID do Supabase Auth                |
| email                | string     | Email do usuário                   |
| name                 | string     | Nome do usuário                    |
| lang_native          | string     | Código do idioma nativo            |
| is_premium           | boolean    | Status de assinatura premium       |
| stripe_customer_id   | string     | ID do cliente na Stripe            |
| subscription_status  | string     | Ex: active, canceled               |
| subscription_renewal | timestamp  | Data de renovação da assinatura    |

### `lang_native`
Idiomas disponíveis como idioma nativo.

### `lang_learn`
Idiomas disponíveis para serem aprendidos.

### `translations`
Traduções das strings do app para diferentes idiomas.

### `lessons`
Metadados das lições disponíveis no sistema.

### `lessons_content`
Conteúdo das lições: áudio, texto original e tradução.

---

## 📁 Organização de Páginas

### Página 0: Splash Screen
- Exibe a logo com efeito "pulse".

### Página 1: Seleção de Idioma Nativo
- Lista de idiomas com bandeiras e frases como "Eu falo português".

### Página 2: Seleção de Lição
- Lista de lições organizadas por tipo (Podcast, Diálogo, Palavras, etc).
- Filtragem dinâmica com base nos idiomas.

### Página 3: Player de Áudio e Texto
- Reproduz áudios em sequência
- Exibe/oculta texto original e tradução
- Gravação de voz e reprodução do áudio gravado

### Página 4: Perfil do Usuário
- Dados do usuário
- Status da assinatura
- Acesso ao portal da Stripe
- Alterar idioma nativo

### Página 5 e 6: Termos de Uso e Política de Privacidade
- Texto fixo com estrutura em headings (H1, H2...)

---

## 🎧 Funcionalidades do Player

- Reproduzir/pausar
- Avançar/retroceder áudios
- Repetição automática com intervalo e quantidade
- Mostrar/ocultar texto original e tradução
- Gravar voz do usuário (áudio local, sem armazenar)
- Reproduzir o áudio gravado

---

## 💳 Integração com Stripe

- Checkout para assinatura anual (com possibilidade futura de mensal)
- Webhook para lidar com criação, renovação e cancelamento de assinaturas
- Link para o portal de gerenciamento da Stripe
- Controle de acesso baseado no `lesson_access` e status da assinatura

---

## 🔒 Autenticação

- Login exclusivo via Google (Supabase Auth)
- Ao logar, criar entrada na tabela `users` se não existir

---

## 📡 Rotas da API (Backend)

| Método | Rota                            | Função                                     |
|--------|----------------------------------|--------------------------------------------|
| GET    | `/me`                            | Dados do usuário logado                    |
| POST   | `/update-lang-native`           | Atualiza idioma nativo                     |
| GET    | `/lang/native`                  | Lista idiomas nativos                      |
| GET    | `/lang/learn?lang_native=pt`   | Lista idiomas que podem ser aprendidos     |
| GET    | `/lessons`                      | Lista de lições com tradução               |
| GET    | `/lessons/:id/types`           | Tipos de lições disponíveis por idioma     |
| GET    | `/lessons/:id/content`         | Conteúdo da lição (áudio + texto)          |
| POST   | `/checkout`                     | Iniciar sessão de pagamento Stripe         |
| GET    | `/billing-portal`              | Retorna link do portal Stripe              |
| POST   | `/webhooks/stripe`             | Webhook para atualizar status da assinatura |
| GET    | `/admin/tags` (opcional)       | Retorna tags de ads                        |
| POST   | `/admin/tags` (opcional)       | Salva tags de ads                          |

---

## 🧩 Funcionalidades Adicionais

- Google Analytics (cliques em botões de conversão)
- Sistema de tags para Ads (Google, Meta, X Ads)
- Bloqueio de tradução automática dos navegadores

---

## ⚠️ Observações Importantes

- Os áudios gravados pelo usuário **não devem ser armazenados**.
- O sistema precisa bloquear o navegador de tentar traduzir o conteúdo (HTML meta tag + header).
- A tradução exibida para o usuário deve vir do banco, nunca via plugin externo.

---

