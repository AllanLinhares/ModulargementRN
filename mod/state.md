 # Padrão State aplicado ao projeto

## Objetivo
O padrão State foi aplicado ao projeto para permitir que as telas de módulo sejam trocadas dinamicamente pelo usuário, mantendo cada módulo responsável pela própria renderização e inicialização de dados.

O foco não é apenas organizar o fluxo de tarefas; ele se estende à personalização de módulos na tela principal do app.

## Arquitetura implementada
O projeto agora usa uma estrutura baseada em estados de módulo:
- `ModuloState` como classe base
- estados concretos para cada módulo de tela
- um seletor de módulo que escolhe o estado atual
- a tela principal que delega renderização e carga de dados ao estado ativo

### Arquivos e responsabilidades

#### `mod/app/modules/moduloState.js`
- Define a classe base `ModuloState` com dois métodos principais:
  - `renderizar()`
  - `carregarDados()`
- Implementa três estados concretos:
  - `ModuloDashboard`
  - `ModuloRelatorios`
  - `ModuloPomodoro`
- Cada classe concreta devolve o componente visual correspondente em `renderizar()` e registra sua rotina de inicialização em `carregarDados()`.
- Exporta também a lista `modulosDisponiveis`, que contém os módulos que o usuário pode selecionar.

#### `mod/app/modules/DashboardModule.jsx`
- Componente de apresentação do módulo Dashboard.
- Mostra título e descrição do módulo.
- Serve como camada visual separada da lógica de estado.

#### `mod/app/modules/RelatoriosModule.jsx`
- Componente que apresenta a tela de relatórios.
- Permite isolar a interface de relatórios do restante do fluxo de navegação.

#### `mod/app/modules/PomodoroModule.jsx`
- Componente que apresenta a tela de configuração do Pomodoro.
- Representa um módulo independente com sua própria UI.

#### `mod/app/modules/ModuleSelector.jsx`
- Exibe botões para cada módulo disponível.
- Recebe `options`, `selectedId` e `onSelect`.
- Quando o usuário seleciona um módulo, chama `onSelect(option)` para trocar o estado atual.
- O botão selecionado recebe estilo diferente para indicar o módulo ativo.

#### `mod/app/(tabs)/index.jsx`
- Mantém o fluxo de login Google existente.
- Adiciona o gerenciamento de módulo por meio de `useState`:
  - `estadoAtual` guarda o objeto de estado de módulo ativo
  - `selectedModuleId` controla qual botão está ativo no seletor
- Usa `useEffect` para disparar `estadoAtual.carregarDados()` sempre que o usuário estiver autenticado e o módulo atual mudar.
- Renderiza uma UI composta:
  - tela de login enquanto `auth` é nulo
  - após login, mostra `ModuleSelector` e `estadoAtual.renderizar()`.

## Trechos de código

### `mod/app/modules/moduloState.js`
```js
import React from "react";
import DashboardModule from "./DashboardModule";
import RelatoriosModule from "./RelatoriosModule";
import PomodoroModule from "./PomodoroModule";

export class ModuloState {
  renderizar() {
    return null;
  }

  carregarDados() {
    return Promise.resolve();
  }
}

export class ModuloDashboard extends ModuloState {
  renderizar() {
    return <DashboardModule />;
  }

  async carregarDados() {
    console.log("Carregando dados do Dashboard...");
    return Promise.resolve();
  }
}

export class ModuloRelatorios extends ModuloState {
  renderizar() {
    return <RelatoriosModule />;
  }

  async carregarDados() {
    console.log("Carregando relatórios...");
    return Promise.resolve();
  }
}

export class ModuloPomodoro extends ModuloState {
  renderizar() {
    return <PomodoroModule />;
  }

  async carregarDados() {
    console.log("Carregando preferências do Pomodoro...");
    return Promise.resolve();
  }
}

export const modulosDisponiveis = [
  { id: "dashboard", label: "Dashboard", state: new ModuloDashboard() },
  { id: "relatorios", label: "Relatórios", state: new ModuloRelatorios() },
  { id: "pomodoro", label: "Pomodoro", state: new ModuloPomodoro() },
];
```

### `mod/app/modules/ModuleSelector.jsx`
```js
import { View, Pressable, Text, StyleSheet } from "react-native";

export function ModuleSelector({ options, selectedId, onSelect }) {
  return (
    <View style={styles.row}>
      {options.map((option) => (
        <Pressable
          key={option.id}
          onPress={() => onSelect(option)}
          style={({ pressed }) => [
            styles.button,
            selectedId === option.id && styles.buttonSelected,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={
              selectedId === option.id
                ? styles.buttonTextSelected
                : styles.buttonText
            }
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#ececec",
    alignItems: "center",
  },
  buttonSelected: {
    backgroundColor: "#008080",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#333",
    fontWeight: "600",
  },
  buttonTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
```

### `mod/app/(tabs)/index.jsx`
```js
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ModuloDashboard,
  modulosDisponiveis,
} from "../modules/moduloState";
import { ModuleSelector } from "../modules/ModuleSelector";

GoogleSignin.configure({
  iosClientId:
    "544777953239-3j817hg27ifuvdgdcb96e2imjd7er0ro.apps.googleusercontent.com",
});

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [auth, setAuth] = useState(null);
  const [estadoAtual, setEstadoAtual] = useState(new ModuloDashboard());
  const [selectedModuleId, setSelectedModuleId] = useState("dashboard");

  useEffect(() => {
    if (auth) {
      estadoAtual.carregarDados();
    }
  }, [auth, estadoAtual]);

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

  function handleSelectModule(option) {
    setEstadoAtual(option.state);
    setSelectedModuleId(option.id);
  }

  return (
    <ScrollView contentContainerStyle={styles.backgroundColor}>
      <Text style={styles.title}>Entrar ao Modulargement</Text>
      <Text style={styles.subtitle}>
        Organize estudos, tarefas e receba dicas da IA
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <View style={styles.optionsRow}>
        <TouchableOpacity>
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.or}>ou</Text>
      <Button title="Entrar com Google" onPress={handleGoogleSignIn} />

      {auth && (
        <View style={styles.moduleContainer}>
          <Text style={styles.sectionTitle}>Bem-vindo, {auth.user.name}</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha um módulo para personalizar sua tela.
          </Text>
          <ModuleSelector
            options={modulosDisponiveis}
            selectedId={selectedModuleId}
            onSelect={handleSelectModule}
          />
          <View style={styles.screenWrapper}>{estadoAtual.renderizar()}</View>
        </View>
      )}

      <TouchableOpacity>
        <Text style={styles.link}>Não tem conta? Criar conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

## Fluxo de execução
1. O app exibe a tela de login com Google.
2. Quando o usuário se autentica, `auth` é definido.
3. A área de módulos é exibida com:
   - seleção de módulos
   - a renderização do módulo atual
4. Ao clicar em um módulo, o `ModuleSelector` troca o estado atual:
   - `setEstadoAtual(option.state)`
   - `setSelectedModuleId(option.id)`
5. O componente principal chama `estadoAtual.renderizar()` para exibir o módulo.
6. O hook `useEffect()` chama `estadoAtual.carregarDados()` para o módulo ativo.

## Padrão State na prática
Cada módulo encapsula duas responsabilidades:
- UI do módulo (`renderizar()`)
- inicialização/carregamento de dados do módulo (`carregarDados()`)

A tela principal passa a agir como um contexto que:
- controla qual módulo está ativo
- fornece seleção de módulos
- executa a transição entre módulos
- delega a lógica de cada módulo para o próprio objeto de estado

## Benefícios específicos desta implementação
- separação clara entre navegação/login e módulos de conteúdo
- adição de novos módulos fica simples: criar uma nova classe e novo componente
- a lógica de carregamento de dados permanece dentro do módulo correspondente
- interface de seleção de módulo fica independente da UI de login
- facilita a customização da tela do usuário com módulos diferentes

## Observações
- Esta implementação usa o State Pattern em um sentido orientado a objetos, onde cada módulo é um estado concreto.
- Não foi alterada a estrutura de `Tabs` do `expo-router`; a solução vive dentro de `mod/app/(tabs)/index.jsx` como o ponto de entrada para o modo de módulos.

## Pontos de evolução
- mais tarde, as classes podem ser transformadas em objetos puros ou hooks se o projeto for migrar para uma arquitetura de função mais funcional.
- `carregarDados()` pode ser ampliado para buscar APIs reais, carregar AsyncStorage ou consultar back-end.
