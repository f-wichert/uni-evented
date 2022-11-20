import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import yellowSplash from '../../assets/yellow_splash.png';
import { RootNavigatorParams } from '../App';
import { Context as AuthContext } from '../contexts/authContext';
import { asyncHandler } from '../util';

type ComponentProps = NativeStackScreenProps<RootNavigatorParams, 'LoginScreen'>;

function LoginScreen({ navigation }: ComponentProps) {
  async function login() {
    console.log(`log: ${user}`);
    // TODO: require these to be non-empty in the UI
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // await signin({ email: user!, password: password! });
    navigation.navigate('TabScreen');
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
        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#bdbdbd'
        }}>
          Please sign in to continue.
        </Text>
      </View>
      
      <View style={{...styles.userInputBox, ...styles.elevation}}>
        <Ionicons name={'person-outline'} size={20} color={'black'} />
        <TextInput 
          style={styles.userInput} 
          onChangeText={setUser} 
          onFocus={() => console.log('focused')}/>
      </View>
      <View style={{...styles.passwInputBox, ...styles.elevation}}>
        <Ionicons name={'lock-closed-outline'} size={20} color={'black'} />
        <TextInput style={styles.passwordInput} secureTextEntry={true} onChangeText={setPassword} />
      </View>

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

      <View style={styles.footerText}>
        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#bdbdbd'
          }}
        >
          Don't have an account? 
        </Text>
        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#D9B611'
          }}
        >
          Sign up
        </Text>
      </View>


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
  userInputBox: {
    height: 40,
    width: 300,
    flexDirection: 'row',
    // justifyContent: 'center'
    paddingLeft: 5,
    alignItems: 'center',
    marginBottom: 20,
    // borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#efefef'
  },
  passwInputBox: {
    height: 40,
    width: 300,
    flexDirection: 'row',
    // justifyContent: 'center'
    paddingLeft: 5,
    alignItems: 'center',
    marginBottom: 20,
    // borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#efefef'
  },
  userInput: {
    height: 40,
    width: 200,
    // marginBottom: 10,
    // borderWidth: 1,
    // borderRadius: 5,
  },
  passwordInput: {
    height: 40,
    width: 200,
    // marginBottom: 10,
    // borderWidth: 1,
    // borderRadius: 5,
  },
  headerText: {
    height: 80,
    marginTop: 200,
    marginBottom: 70,
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  loginButton: {
    width: 110,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9B611',
    borderRadius: 20,
    marginBottom: 270
  },
  art: {
    height: 260,
    width: 400,
    position: 'absolute',
    transform: [{ translateX: 80 }, { rotate: '-120deg' }],
  },
  shadowProp: {
    shadowColor: '#52006A',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 15,
    shadowColor: '#71717',
  },
  footerText: {
    justifyContent: 'center',
    flexDirection: 'row',
    // bottom: 
  }
});

export default LoginScreen;
