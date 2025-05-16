# 🔄 LocalSync RN

**LocalSync RN** é uma implementação de aplicativo Local-First usando Legend State para React Native.

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Legend State](https://img.shields.io/badge/Legend_State-7749BD?style=for-the-badge)](https://legendapp.com/open-source/state/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Offline First](https://img.shields.io/badge/Offline_First-45ADA8?style=for-the-badge)](https://offlinefirst.org/)

## 🇧🇷 Português

### 📱 Sobre

LocalSync RN é um projeto demonstrativo de uma aplicação React Native que implementa o padrão Local-First usando Legend State. O app permite que usuários criem, visualizem, editem e excluam posts mesmo quando estão offline, com sincronização automática quando a conexão com a internet é restabelecida.

### ✨ Características

- **Funcionamento Offline**: Todas as operações CRUD funcionam mesmo sem conexão
- **Sincronização Automática**: Dados são sincronizados com o backend quando online
- **Persistência Cross-Platform**: LocalStorage (web) e MMKV (mobile)
- **UI Responsiva**: Indicadores visuais de status de conexão, loading e erros
- **Gerenciamento de Estado Reativo**: Usando Legend State para performance e simplicidade

### 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/lumamontes/local-first-legend-state.git

# Entre na pasta do projeto
cd localsync-rn

# Instale as dependências
npm install
# ou
yarn install

# Inicie o app
npm start
# ou
yarn start
```

### 🔧 Configuração da API

Por padrão, o app está configurado para se conectar a uma API local em `http://localhost:3000/api`. Você pode modificar a URL no arquivo `src/store/posts.ts`: Você pode hostear a api em um serviço como o ngrok para testar o modo online/offline.

```typescript
const API_URL = 'http://localhost:3000/api';
```

### 📖 Como Funciona

O aplicativo utiliza o Legend State com o plugin `syncedCrud` para:

1. Armazenar todas as operações localmente primeiro
2. Sincronizar com o backend de maneira automática quando online
3. Persistir dados entre sessões com LocalStorage (web) ou MMKV (mobile)
4. Gerenciar retentativas de sincronização em caso de falhas

### 📝 Licença

MIT

---

## 🇺🇸 English

### 📱 About

LocalSync RN is a demonstration project of a React Native application that implements the Local-First pattern using Legend State. The app allows users to create, view, edit, and delete posts even when offline, with automatic synchronization when the internet connection is reestablished.

### ✨ Features

- **Offline Functionality**: All CRUD operations work even without connection
- **Automatic Synchronization**: Data is synchronized with the backend when online
- **Cross-Platform Persistence**: LocalStorage (web) and MMKV (mobile)
- **Responsive UI**: Visual indicators of connection status, loading, and errors
- **Reactive State Management**: Using Legend State for performance and simplicity

### 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/lumamontes/local-first-legend-state.git

# Enter the project folder
cd localsync-rn

# Install dependencies
npm install
# or
yarn install

# Start the app
npm start
# or
yarn start
```

### 🔧 API Configuration

By default, the app is configured to connect to a local API at `http://localhost:3000/api`. You can modify the URL in the `src/store/posts.ts` file:

```typescript
const API_URL = 'http://localhost:3000/api';
```

### 📖 How It Works

The application uses Legend State with the `syncedCrud` plugin to:

1. Store all operations locally first
2. Synchronize with the backend automatically when online
3. Persist data between sessions with LocalStorage (web) or MMKV (mobile)
4. Manage synchronization retries in case of failures

### 📝 License

MIT
