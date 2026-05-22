import { View, Text, StyleSheet } from "react-native";

export default function PomodoroModule() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro</Text>
      <Text style={styles.description}>
        Mostra opções de configuração e as preferências do temporizador.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff7e6",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8a4b00",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
});
