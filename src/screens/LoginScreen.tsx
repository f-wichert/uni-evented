import React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

function LoginScreen(props) {

    function login() {
        console.log(`log: ${user}`);
        
        return true
    }

    const [user, setUser] = React.useState();
    const [password, setPassword] = React.useState();


    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 34,
                fontWeight: 'bold'
            }}>Evented</Text>
            <TextInput 
                style={styles.userInput} 
                onChangeText={setUser} />
            <TextInput 
                style={styles.passwordInput} 
                secureTextEntry={true} 
                onChangeText={setPassword} />
            <Button 
                title={'Join!'}
                onPress={login} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userInput: {
        height: 40,
        width: 200,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5
    },
    passwordInput: {
        height: 40,
        width: 200,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5
    },

});

export default LoginScreen;
