import { StyleSheet, Text, View, Button, Image} from "react-native"
import { GoogleSignin, User, isSuccessResponse } from '@react-native-google-signin/google-signin'
import {useState} from "react"

GoogleSignin.configure({
  iosClientId: "544777953239-3j817hg27ifuvdgdcb96e2imjd7er0ro.apps.googleusercontent.com"
})

export default function HomeScreen() {
  const[auth, setAuth] = useState<User|null>(null)

  async function handleGoogleSignIn(){
    try {
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()

      if(isSuccessResponse(response)){
        setAuth(response.data)
      }
    } catch(error){
      console.log(error)
    }
  }

  return (
      <View style={styles.container}>
        <Text style={styles.textoBase}>
          Bem vindo ao Modulargement
        </Text>
          <Button 
          title="Entrar com google"
          onPress={handleGoogleSignIn} 
          />
          <Button
          title="Cadastrar"
          color='#8d1414'
          />
          <Button title="Login"/>
          {auth && (
            <View style={styles.container}>
              <Text>{auth.user.name}</Text>
              <Text>{auth.user.email}</Text>
            </View>
          )}
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      opacity: 1,
      backgroundColor: '#d4cbcb',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textoBase:{
      fontSize:24,
      color: '#030202',
      fontWeight: 'bold'
    },
    photo: {
      width: 100,
      height: 100,
    }
});
