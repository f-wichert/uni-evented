import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

import yellowSplash from '../../assets/yellow_splash.png';
import { RootNavigatorParams } from '../App';
import { Context as AuthContext } from '../contexts/authContext';
import { asyncHandler } from '../util';

type ComponentProps = NativeStackScreenProps<RootNavigatorParams, 'LoginScreen'>;

function LoginScreen(props: ComponentProps) {
  async function login() {
    console.log(`log: ${user}`);
    // TODO: require these to be non-empty in the UI
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await signin({ email: user!, password: password! });
    props.navigation.navigate('TabScreen');
  }

  const [user, setUser] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const { /* state, */ signin } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image style={styles.art} source={yellowSplash} />
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
        onPress={asyncHandler(login)}
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
