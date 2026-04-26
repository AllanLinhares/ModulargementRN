import { StyleSheet, Text, View } from 'react-native';

export default function App() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20, color: 'blue' }}>Tela perfil!</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
     },
});
      