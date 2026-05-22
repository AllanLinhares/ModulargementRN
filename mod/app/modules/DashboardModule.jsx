import { View, Text, StyleSheet } from "react-native";

export default function DashboardModule() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.description}>
        Mostra gráficos e estatísticas do seu desempenho.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f0f9ff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#004d66",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
});
