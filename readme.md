Timon Buz
Timon Buz é um aplicativo móvel projetado para ser o seu guia de transporte público na cidade de Timon. Ele conecta passageiros e empresas de ônibus, fornecendo informações sobre linhas, horários e paradas, facilitando a locomoção pela cidade.

🚀 Funcionalidades
O aplicativo possui duas interfaces principais, uma para os passageiros e outra para os administradores das empresas de ônibus.

Para Passageiros
Consulta de Empresas: Visualize todas as empresas de transporte público que operam na cidade.

Visualização de Linhas: Acesse uma lista completa de todas as linhas de ônibus disponíveis.

Detalhes da Viagem: Veja os horários e o itinerário completo de cada viagem, com todas as paradas.

Busca Inteligente: Pesquise por empresas, linhas ou número do ônibus para encontrar rapidamente a informação que você precisa.

Favoritos: Salve suas linhas mais utilizadas para acesso rápido e fácil.

Autenticação: Crie sua conta de passageiro para salvar suas preferências e ter uma experiência personalizada.

Para Empresas (Administradores)
Painel de Gerenciamento: Uma área dedicada para administrar as informações da empresa.

Gestão de Linhas: Crie, edite e remova linhas de ônibus, incluindo nome, número e todos os pontos de parada do itinerário.

Gestão de Viagens: Adicione e gerencie as viagens de cada linha, definindo descrições (ex: "Dias Úteis - Manhã") e dias da semana de operação.

Definição de Horários: Atribua horários de passagem para cada ponto de parada em uma determinada viagem.

Autenticação Segura: Crie uma conta para sua empresa e gerencie suas informações com segurança.

🛠️ Tecnologias Utilizadas
Este projeto foi construído utilizando tecnologias modernas para desenvolvimento móvel:

Frontend:

React Native

Expo

TypeScript

React Navigation para roteamento

Backend & Banco de Dados:

Supabase

Validação de Dados:

Zod

🏁 Como Começar
Para executar este projeto localmente, siga os passos abaixo.

Pré-requisitos
Node.js (versão 18 ou superior)

Yarn ou npm

Expo CLI (npm install -g expo-cli)

Um dispositivo móvel com o app Expo Go ou um emulador (Android Studio / Xcode)

Instalação
Clone o repositório:

git clone https://your-repository-url/timon-buz.git
cd timon-buz

Instale as dependências:

npm install
# ou
yarn install

Configuração do Supabase:

Crie um projeto no Supabase.

No painel do seu projeto, vá para Settings > API.

Copie a Project URL e a anon public key.

Cole essas chaves no arquivo src/service/supabase.ts:

const supabaseUrl = 'SUA_URL_SUPABASE';
const supabaseAnonKey = 'SUA_CHAVE_ANON_SUPABASE';

Você precisará criar as tabelas no seu banco de dados Supabase (users, empresas, linhas, viagens, pontos_itinerario, horarios_ponto, favoritos) para que o aplicativo funcione corretamente.

Executando o Aplicativo
Inicie o servidor de desenvolvimento do Expo:

npx expo start

Abra no seu dispositivo:

iOS: Abra o aplicativo Câmera e escaneie o QR code que aparece no terminal.

Android: Use o aplicativo Expo Go para escanear o QR code.

📂 Estrutura do Projeto
/
├── assets/               # Imagens, ícones e fontes
├── src/
│   ├── components/       # Componentes reutilizáveis (ex: menus)
│   ├── context/          # Provedores de Contexto do React (auth, empresa, linha, etc.)
│   ├── hooks/            # Hooks customizados (ex: useAuth)
│   ├── routes/           # Configuração de navegação e rotas
│   ├── screens/          # Telas principais do aplicativo
│   └── service/          # Configuração do cliente Supabase
├── .gitignore
├── app.json              # Configurações do projeto Expo
├── package.json          # Dependências e scripts do projeto
└── README.md

🤝 Contribuições
Contribuições são sempre bem-vindas! Se você tem alguma ideia para melhorar o aplicativo, sinta-se à vontade para criar uma issue ou enviar um pull request.