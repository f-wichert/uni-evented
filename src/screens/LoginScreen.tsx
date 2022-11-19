import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

import { Context as AuthContext } from '../contexts/authContext';

function LoginScreen(props) {
  async function login() {
    console.log(`log: ${user}`);
    // TODO: something like
    // try {
    //   await signin({ email: user, password: password }, state.token);
    // } catch (e) {
    //   showToast(e.message);
    // }
    await signin({ email: user, password: password }, state.token);
    props.navigation.navigate('TabScreen');
    return true;
  }

  const [user, setUser] = React.useState();
  const [password, setPassword] = React.useState();
  const { state, signin } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image style={styles.art} source={require('../../assets/yellow_splash.png')} />
      <View style={styles.headerText}>
        <Text
          style={{
            fontSize: 44,
            fontWeight: 'bold',
          }}
        >
          Login
        </Text>
      </View>
      <TextInput style={styles.userInput} onChangeText={setUser} />
      <TextInput style={styles.passwordInput} secureTextEntry={true} onChangeText={setPassword} />

      <TouchableHighlight
        style={styles.loginButton}
        // activeOpacity={0.6}
        onPress={login}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Join!
        </Text>
      </TouchableHighlight>
    </View>
  );
}

{
  /* <Button
                title={'Join!'}
                style={styles.loginButton}
                onPress={login} /> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 40,
    // justifyContent: 'center',
    // backgroundColor: 'red'
    // alignItems: 'center'
  },
  userInput: {
    height: 40,
    width: 200,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  passwordInput: {
    height: 40,
    width: 200,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  headerText: {
    height: 80,
    marginTop: 200,
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  loginButton: {
    width: 110,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcba03',
    borderRadius: 20,
  },
  art: {
    height: 260,
    width: 400,
    position: 'absolute',
    transform: [{ translateX: 80 }, { rotate: '-120deg' }],
  },
});

export default LoginScreen;
