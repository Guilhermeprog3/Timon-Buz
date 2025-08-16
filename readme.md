
# 🚌 Timon Buz - Aplicativo Mobile

**Timon Buz** é um aplicativo móvel desenvolvido para auxiliar os cidadãos de **Timon (MA)** no uso do transporte público. A plataforma conecta **passageiros** e **empresas de ônibus**, oferecendo uma experiência prática para consulta de linhas, itinerários, horários e pontos de parada.

> ⚠️ **Importante:** Este repositório corresponde ao **front-end mobile** da aplicação.



---

## 📱 Telas do Aplicativo

<div style="display: flex;">
<img src="./assets/Captura de tela 2025-08-14 203740.png" alt="Tela Inicial" width="395" height="861" style="margin-right: 10px;"/>
<img src="./assets/Captura de tela 2025-08-14 203824.png" alt="Tela de Detalhes" width="395" height="861"/>
</div>

---


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

## ▶️ Como Rodar a Aplicação

1. Clone este repositório:
   ```bash
   git clone https://github.com/Guilhermeprog3/Timon-Buz.git
   cd timon-buz
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   npm start
   ```
   
---
