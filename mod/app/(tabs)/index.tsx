import { StyleSheet, Text, View, Button, Image} from "react-native"
import { GoogleSignin, User, isSuccessResponse } from '@react-native-google-signin/google-signin'
import {useState} from "react"

GoogleSignin.configure({
  iosClientId: "544777953239-3j817hg27ifuvdgdcb96e2imjd7er0ro.apps.googleusercontent.com"
})

export default function HomeScreen() {
  const[auth, setAuth] = useState<User | null>(null)

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
          <Button title="Entrar" onPress={handleGoogleSignIn} />

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
      justifyContent: 'center',
      alignItems: 'center',
    },
    photo: {
      width: 100,
      height: 100,
    }
});
