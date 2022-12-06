import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';

import { RootNavigatorParams } from '../App';
import { AuthContext } from '../contexts/authContext';
import { asyncHandler } from '../util';
import BaseLoginScreen from './base/BaseLoginScreen';

type ComponentProps = NativeStackScreenProps<RootNavigatorParams, 'LoginScreen'>;

export default function LoginScreen({ navigation }: ComponentProps) {
    async function submitLogin() {
        // this automatically navigates to the main screen when the token gets set
        // TODO: require these to be non-empty in the UI
        await signin({ email: user || '', password: password || '' });
    }

    const { signin } = useContext(AuthContext);
    const [user, setUser] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    return (
<<<<<<< HEAD
        <View style={styles.container}>
            <Image style={styles.art} source={yellowSplash} />

            <View style={styles.textBlock}>
                <View style={styles.headerText}>
                    <Text
                        style={{
                            fontSize: 44,
                            fontWeight: 'bold',
                        }}
                    >
                        Login
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#bdbdbd',
                        }}
                    >
                        Please sign in to continue.
                    </Text>
                </View>
            </View>

            <View style={styles.dataBlock}>
                <View style={{ ...styles.userInputBox, ...styles.elevation }}>
                    <Ionicons name={'person-outline'} size={20} color={'black'} />
                    <TextInput
                        style={styles.userInput}
                        onChangeText={setUser}
                        onFocus={() => console.log('focused')}
                        // TODO! Remove bevore deployment! Only for ease of Login
                        defaultValue = 'Bob' 
                        />
                </View>
                <View style={{ ...styles.passwInputBox, ...styles.elevation }}>
                    <Ionicons name={'lock-closed-outline'} size={20} color={'black'} />
                    <TextInput 
                        style={styles.passwordInput}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        // TODO! Remove bevore deployment! Only for ease of Login
                        defaultValue='Verysecure' 
                        />
                </View>

                <TouchableHighlight
                    style={styles.loginButton}
                    // activeOpacity={0.6}
                    onPress={asyncHandler(login)}
                >
                    <ImageBackground
                        source={yellowSplash}
                        resizeMode="contain"
                        style={styles.image}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                            }}
                        >
                            Join!
                        </Text>
                    </ImageBackground>
                </TouchableHighlight>
            </View>

            <View style={styles.infoBlock}>
                <View style={styles.footerText}>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#bdbdbd',
                        }}
                    >
                        Don't have an account?
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#D9B611',
                        }}
                        onPress={() => navigation.navigate('RegisterScreen')}
                    >
                        Sign up
                    </Text>
                </View>
            </View>
        </View>
=======
        <BaseLoginScreen
            fields={[
                { icon: 'person-outline', onChange: setUser },
                {
                    icon: 'lock-closed-outline',
                    onChange: setPassword,
                    textInputProps: { secureTextEntry: true },
                },
            ]}
            submitButton={{
                text: 'Login',
                callback: asyncHandler(submitLogin, { prefix: 'Login failed' }),
            }}
            header={{ title: 'Login', subTitle: 'Please sign in to continue.' }}
            footer={{
                text: "Don't have an account?",
                buttonText: 'Sign up',
                callback: () => navigation.navigate('RegisterScreen'),
            }}
        />
>>>>>>> main
    );
}
