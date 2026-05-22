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

const styles = StyleSheet.create({
  backgroundColor: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  link: {
    color: "#008080",
    fontSize: 14,
    margin: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#008080",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  or: {
    textAlign: "center",
    marginVertical: 8,
    color: "#555",
  },
  moduleContainer: {
    width: "100%",
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#004d66",
  },
  sectionSubtitle: {
    marginBottom: 12,
    color: "#555",
  },
  screenWrapper: {
    marginTop: 16,
  },
});
