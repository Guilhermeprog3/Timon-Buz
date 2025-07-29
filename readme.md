<p align="center">
<img src="assets/icon.png" width="128" alt="Timon Buz logo" />
</p>

<h1 align="center">Timon Buz</h1>

<p align="center">
<strong>Seu guia de transporte público na cidade de Timon.</strong>
</p>

<p align="center">
<img alt="Versão" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
<img alt="Licença: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
<a href="https://github.com/guilhermeprog3/timon-buz/graphs/contributors" alt="Contribuidores">
<img src="https://img.shields.io/github/contributors/guilhermeprog3/timon-buz" />
</a>
</p>

O Timon Buz é um aplicativo móvel projetado para conectar passageiros e empresas de ônibus, fornecendo informações sobre linhas, horários e paradas, facilitando a locomoção pela cidade.

🚀 Funcionalidades
O aplicativo possui duas interfaces principais: uma para os passageiros e outra para os administradores das empresas de ônibus.

Para Passageiros
Consulta de Empresas: Visualize todas as empresas de transporte público que operam na cidade.

Visualização de Linhas: Acesse uma lista completa de todas as linhas de ônibus disponíveis.

Detalhes da Viagem: Veja os horários e o itinerário completo de cada viagem, com todas as paradas.

Busca Inteligente: Pesquise por empresas, linhas ou número do ônibus.

Favoritos: Salve suas linhas mais utilizadas para acesso rápido.

Autenticação: Crie sua conta para salvar suas preferências e ter uma experiência personalizada.

Para Empresas (Administradores)
Painel de Gerenciamento: Uma área dedicada para administrar as informações da empresa.

Gestão de Linhas: Crie, edite e remova linhas de ônibus, incluindo nome, número e itinerário.

Gestão de Viagens: Adicione e gerencie as viagens de cada linha, definindo descrições e dias de operação.

Definição de Horários: Atribua horários para cada ponto de parada em uma determinada viagem.

Autenticação Segura: Crie uma conta para sua empresa e gerencie suas informações com segurança.

🛠️ Tecnologias Utilizadas
Este projeto foi construído utilizando tecnologias modernas para desenvolvimento móvel:

Frontend:

React Native

Expo

TypeScript

React Navigation

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

Você precisará criar as tabelas no seu banco de dados Supabase para que o aplicativo funcione corretamente.

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
│   ├── components/       # Componentes reutilizáveis
│   ├── context/          # Provedores de Contexto do React
│   ├── hooks/            # Hooks customizados
│   ├── routes/           # Configuração de navegação
│   ├── screens/          # Telas do aplicativo
│   └── service/          # Configuração do Supabase
├── app.json              # Configurações do projeto Expo
├── package.json          # Dependências e scripts
└── README.md

🤝 Contribuições
Contribuições são sempre bem-vindas! Se você tem alguma ideia para melhorar o aplicativo, sinta-se à vontade para criar uma issue ou enviar um pull request.