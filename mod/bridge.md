# Padrão Bridge - Modulargement

## 📋 Resumo Executivo

O padrão **Bridge** foi aplicado ao projeto Modulargement para **desacoplar abstrações de implementações**, permitindo que ambas variem **independentemente** sem afetar o código cliente.

---

## 🎯 Problema Original

### ❌ Antes - Código Acoplado

```javascript
// ❌ index.jsx - Acoplado diretamente ao Google Sign In
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";

GoogleSignin.configure({
  iosClientId: //
});

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [auth, setAuth] = useState(null);

  async function handleGoogleSignIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setAuth(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return <View>{/* UI */}</View>;
}
```

**Problemas:**

- ❌ Difícil trocar de provider de autenticação (ex: Email, GitHub, Microsoft)
- ❌ Testabilidade limitada
- ❌ Storage diretamente acoplado no tasks.jsx
- ❌ Código replicado entre componentes

---

## ✅ Solução - Padrão Bridge

### 1️⃣ **Autenticação com Bridge**

#### Passo 1: Definir Interface (Abstração)

```typescript
// services/auth/types.ts
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IAuthProvider {
  signIn(email?: string, password?: string): Promise<AuthResponse>;
  signInWithGoogle(): Promise<AuthResponse>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}
```

#### Passo 2: Implementar Provedores (Bridge)

```typescript
// services/auth/GoogleAuthProvider.ts
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { IAuthProvider, AuthResponse } from "./types";

export class GoogleAuthProvider implements IAuthProvider {
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        return {
          user: {
            id: response.data.user.id,
            name: response.data.user.name || "",
            email: response.data.user.email,
          },
          token: response.data.idToken,
        };
      }
      throw new Error("Google sign in failed");
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    await GoogleSignin.signOut();
  }

  async getCurrentUser() {
    const user = await GoogleSignin.getCurrentUser();
    return user ? /* mapear dados */ : null;
  }
}
```

```typescript
// services/auth/EmailAuthProvider.ts
export class EmailAuthProvider implements IAuthProvider {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch("https://seu-backend.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Falha na autenticação");

    const data = await response.json();
    return {
      user: { id: data.userId, name: data.name, email: data.email },
      token: data.token,
    };
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    throw new Error("Email provider não suporta Google Sign In");
  }
}
```

#### Passo 3: Criar Serviço Bridge

```typescript
// services/auth/AuthService.ts
import { IAuthProvider, AuthResponse, AuthUser } from "./types";

export class AuthService {
  constructor(private provider: IAuthProvider) {}

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return this.provider.signIn(email, password);
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    return this.provider.signInWithGoogle();
  }

  async signOut(): Promise<void> {
    return this.provider.signOut();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.provider.getCurrentUser();
  }

  // Trocar provider em tempo de execução
  setProvider(provider: IAuthProvider): void {
    this.provider = provider;
  }
}
```

#### Passo 4: Usar no Componente

```typescript
// ✅ DEPOIS - Desacoplado usando Bridge

export default function HomeScreen() {
  const authService = useAuthService(); // ← Injetado via Context
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [auth, setAuth] = useState(null);

  async function handleEmailSignIn() {
    try {
      const response = await authService.signIn(email, senha); // ← Agnóstico do provider
      setAuth(response);
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  async function handleGoogleSignIn() {
    try {
      const response = await authService.signInWithGoogle(); // ← Mesmo método
      setAuth(response);
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  return (
    <View style={styles.backgroundColor}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleEmailSignIn}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Button title="Entrar com Google" onPress={handleGoogleSignIn} />
    </View>
  );
}
```

#### Passo 5: Configurar Provider na Raiz

```typescript
// app/_layout.jsx
import { AuthProvider } from '@/services/auth/AuthProvider';
import { GoogleAuthProvider } from '@/services/auth/GoogleAuthProvider';

export default function RootLayout() {
  // Escolher qual provider usar (fácil trocar!)
  const authProvider = new GoogleAuthProvider();
  // OU: const authProvider = new EmailAuthProvider();

  return (
    <AuthProvider provider={authProvider}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
```

---

### 2️⃣ **Storage com Bridge**

```typescript
// services/storage/StorageService.ts

export interface IStorageProvider {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Implementação 1: AsyncStorage (Produção)
export class AsyncStorageProvider implements IStorageProvider {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }
}

// Implementação 2: Memory (Testes)
export class MemoryStorageProvider implements IStorageProvider {
  private store = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }
  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
}

// Bridge
export class StorageService {
  constructor(private provider: IStorageProvider) {}

  async getItem(key: string): Promise<string | null> {
    return this.provider.getItem(key);
  }
  async setItem(key: string, value: string): Promise<void> {
    return this.provider.setItem(key, value);
  }
}
```

#### Uso em tasks.jsx

```typescript
// ❌ ANTES
import AsyncStorage from "@react-native-async-storage/async-storage";

const jsonValue = await AsyncStorage.getItem("TodoApp");

// ✅ DEPOIS
const storageService = new StorageService(new AsyncStorageProvider());

const jsonValue = await storageService.getItem("TodoApp");
// Em testes:
const testStorage = new StorageService(new MemoryStorageProvider());
const jsonValue = await testStorage.getItem("TodoApp");
```

---

### 3️⃣ **Tema com Bridge**

```typescript
// services/theme/ThemeService.ts

export interface IThemeProvider {
  getTheme(colorScheme: 'light' | 'dark'): ThemePalette;
  getAllThemes(): string[];
  switchTheme(themeName: string): void;
}

// Implementação 1: Temas locais
export class DefaultThemeProvider implements IThemeProvider {
  private themes = new Map([
    ['default', { name: 'Default', colors: { light: {...}, dark: {...} } }],
    ['ocean', { name: 'Ocean', colors: { light: {...}, dark: {...} } }],
  ]);

  getTheme(colorScheme: 'light' | 'dark'): ThemePalette {
    return this.themes.get(this.currentTheme).colors[colorScheme];
  }
}

// Implementação 2: Temas do servidor (ex: White Label)
export class RemoteThemeProvider implements IThemeProvider {
  async loadThemesFromServer(url: string): Promise<void> {
    const response = await fetch(url);
    const themes = await response.json();
    // Carregar temas dinamicamente
  }

  getTheme(colorScheme: 'light' | 'dark'): ThemePalette {
    // Retornar tema do servidor
  }
}

// Bridge
export class ThemeService {
  constructor(private provider: IThemeProvider) {}

  getTheme(colorScheme: 'light' | 'dark'): ThemePalette {
    return this.provider.getTheme(colorScheme);
  }
}
```

---

## 📊 Comparação: Antes vs Depois

| Aspecto                     | ❌ Antes (Acoplado)            | ✅ Depois (Bridge)                       |
| --------------------------- | ------------------------------ | ---------------------------------------- |
| **Trocar de Auth Provider** | Refatorar index.jsx            | Mudar 1 linha: `new EmailAuthProvider()` |
| **Adicionar novo provider** | Modificar index.jsx            | Criar nova classe, sem alterar existente |
| **Testar com dados mock**   | Impossível sem refatoração     | `new MemoryStorageProvider()`            |
| **Suportar temas remotos**  | Reescrever ThemeContext        | Criar `RemoteThemeProvider`              |
| **Dependências**            | Google Sign In acoplado        | Injetável em tempo de execução           |
| **Código reutilizável**     | Não, específico por componente | Sim, AuthService é genérico              |

---

## 🔄 Fluxo de Dados com Bridge

```
┌─────────────────────┐
│   Componentes React │  (homeScreen, tasks.jsx)
│   (não sabem da     │
│    implementação)   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   AuthService       │  ← BRIDGE (agnóstico)
│   StorageService    │
│   ThemeService      │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────────────────────┐
│   Implementações (intercambiáveis)  │
├─────────────────────────────────────┤
│ • GoogleAuthProvider                │
│ • EmailAuthProvider                 │
│ • AsyncStorageProvider              │
│ • MemoryStorageProvider             │
│ • DefaultThemeProvider              │
│ • RemoteThemeProvider               │
└─────────────────────────────────────┘
```

---

## 🎁 Benefícios Obtidos

### 1. **Extensibilidade**

```typescript
// Adicionar novo provider sem alterar componentes
export class GitHubAuthProvider implements IAuthProvider {
  async signIn(): Promise<AuthResponse> {
    /* ... */
  }
}

// Usar imediatamente
const authProvider = new GitHubAuthProvider();
```

### 2. **Testabilidade**

```typescript
// ✅ Testes com mock
const mockAuthService = new AuthService(new MockAuthProvider());
await mockAuthService.signIn("test@test.com", "password");

// ✅ Testes de storage com dados em memória
const testStorage = new StorageService(new MemoryStorageProvider());
```

### 3. **Flexibilidade em Tempo de Execução**

```typescript
// Trocar provider dinamicamente
if (useGoogleAuth) {
  authService.setProvider(new GoogleAuthProvider());
} else {
  authService.setProvider(new EmailAuthProvider());
}
```

### 4. **Separação de Conceitos**

- Componentes = apresentação
- Services = lógica agnóstica
- Providers = implementações específicas

---

## 📁 Estrutura de Arquivos Criada

```
services/
├── auth/
│   ├── types.ts                    ← Interfaces
│   ├── GoogleAuthProvider.ts       ← Implementação 1
│   ├── EmailAuthProvider.ts        ← Implementação 2
│   ├── AuthService.ts              ← Bridge
│   ├── AuthProvider.tsx            ← React Context
│   └── AuthContext.ts              ← Contexto
├── storage/
│   ├── StorageService.ts           ← Bridge + Implementações
│   └── types.ts
└── theme/
    ├── ThemeService.ts             ← Bridge + Implementações
    └── types.ts
```

---

## 🚀 Como Implementar

### Passo 1: Criar os services

```bash
mkdir -p services/auth services/storage services/theme
```

### Passo 2: Copiar os arquivos criados

- [types.ts](services/auth/types.ts)
- [GoogleAuthProvider.ts](services/auth/GoogleAuthProvider.ts)
- [EmailAuthProvider.ts](services/auth/EmailAuthProvider.ts)
- [AuthService.ts](services/auth/AuthService.ts)

### Passo 3: Envolver a app com Provider

```typescript
// app/_layout.jsx
<AuthProvider provider={new GoogleAuthProvider()}>
  {/* Stack */}
</AuthProvider>
```

### Passo 4: Usar nos componentes

```typescript
const authService = useAuthService();
await authService.signIn(email, password);
```

---

## ✨ Conclusão

O padrão **Bridge** transformou seu projeto de um sistema **rigidamente acoplado** para uma arquitetura **flexível e escalável**, onde:

✅ Novas implementações podem ser adicionadas sem modificar código existente
✅ Componentes não conhecem detalhes de implementação
✅ Testes unitários são triviais de fazer
✅ Provider pode ser trocado em tempo de execução

**Resultado:** Código mais profissional, testável e preparado para crescimento! 🎉
