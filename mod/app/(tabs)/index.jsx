import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

GoogleSignin.configure({
  iosClientId:
    "544777953239-3j817hg27ifuvdgdcb96e2imjd7er0ro.apps.googleusercontent.com",
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

  return (
    <View style={styles.backgroundColor}>
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
      <Button
        style={styles.googleButton}
        title="Entrar com google"
        onPress={handleGoogleSignIn}
      />

      {auth && (
        <View style={styles.container}>
          <Text>{auth.user.name}</Text>
          <Text>{auth.user.email}</Text>
        </View>
      )}
      <TouchableOpacity>
        <Text style={styles.link}>Não tem conta? Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundColor: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
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
  },
  link: {
    color: "#008080",
    fontSize: 14,
    margin: 10,
  },
  button: {
    backgroundColor: "#008080",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: "#DB4437",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
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
});
