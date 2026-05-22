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
