
---

````markdown
# 🚌 Timon Buz - Aplicativo Mobile

**Timon Buz** é um aplicativo móvel desenvolvido para auxiliar os cidadãos de **Timon (MA)** no uso do transporte público. A plataforma conecta **passageiros** e **empresas de ônibus**, oferecendo uma experiência prática para consulta de linhas, itinerários, horários e pontos de parada.

> ⚠️ **Importante:** Este repositório corresponde ao **front-end mobile** da aplicação.

---

## 🚀 Tecnologias Utilizadas

- **React Native** com **Expo**
- **TypeScript**
- **React Navigation** para navegação entre telas
- **Zod** para validação de formulários
- **Supabase** como backend e banco de dados

---

## 🎨 Paleta de Cores

| Cor         | Uso                          |
|-------------|------------------------------|
| `#EFAE0C`   | Cor principal (destaques)     |
| `#291F75`   | Cor secundária (menus e fundo)|
| `#FFFFFF`   | Fundo de conteúdo             |

---

## 👥 Funcionalidades

### Para Passageiros

- 🔍 **Consulta de Empresas:** Veja todas as empresas que operam na cidade.
- 🗺️ **Visualização de Linhas:** Veja todas as linhas e seus itinerários.
- 🕒 **Detalhes da Viagem:** Consulte horários e pontos de parada em cada viagem.
- 💡 **Busca Inteligente:** Pesquise por empresa, linha ou número do ônibus.
- ⭐ **Favoritos:** Salve suas linhas mais utilizadas.
- 🔐 **Autenticação:** Crie uma conta para salvar preferências e ter uma experiência personalizada.

### Para Empresas (Administradores)

- 🧭 **Painel de Gerenciamento:** Área para administrar informações da empresa.
- 🛣️ **Gestão de Linhas:** Crie, edite e remova linhas, definindo nome e pontos fixos.
- 🕑 **Gestão de Viagens:** Crie viagens com horários e dias da semana de operação (ex: seg a sex, seg a dom).
- 📍 **Definição de Horários:** Cadastre o horário de passagem em cada ponto.
- 🔐 **Autenticação Segura:** Login individual da empresa com acesso protegido.
---

## 🧪 Como Rodar o Projeto Localmente


### 📦 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Guilhermeprog3/timon-buz.git
cd timon-buz

# 2. Instale as dependências
yarn install
# ou
npm install
````

### 🔗 Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com/)
2. No painel do projeto, vá em **Settings > API**
3. Copie a **Project URL** e **anon public key**
4. Cole no arquivo `src/service/supabase.ts`:

```ts
const supabaseUrl = 'SUA_URL_SUPABASE';
const supabaseAnonKey = 'SUA_CHAVE_ANON_SUPABASE';
```

5. Crie no Supabase as seguintes tabelas:

   * `users`
   * `empresas`
   * `linhas`
   * `pontos_itinerario`
   * `viagens`
   * `horarios_ponto`
   * `favoritos`

---

## ▶️ Executando o App

```bash
# Inicie o servidor de desenvolvimento Expo
npx expo start
```

Abra o QR Code com:

* **iOS:** Câmera nativa
* **Android:** App **Expo Go**

---

## 📂 Estrutura do Projeto

```
/
├── assets/               # Imagens, ícones e fontes
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── context/          # Contextos globais (auth, empresa, etc.)
│   ├── hooks/            # Hooks customizados
│   ├── routes/           # Navegação
│   ├── screens/          # Telas do app
│   └── service/          # Conexão com Supabase
├── .gitignore
├── app.json              # Configurações do projeto Expo
├── package.json
└── README.md
```
