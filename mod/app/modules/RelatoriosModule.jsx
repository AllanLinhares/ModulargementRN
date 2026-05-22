import { View, Text, StyleSheet } from "react-native";

export default function RelatoriosModule() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>
      <Text style={styles.description}>
        Mostra a lista de relatórios e a última coleta do banco de dados.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f7f7ff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2a2a72",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
});
