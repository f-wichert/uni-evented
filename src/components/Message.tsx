import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUserStore } from '../state/user';

function Message(props) {
    const message = props.message;
    const userId = useUserStore((state) => state.currentUserId);
    var left = props.message.messageCorrespondent == userId ? true : false;

    // const user = useUserStore((state) => state.fetchCurrentUser());
    // console.log(`User: ${JSON.stringify(user)}`);

    return (
        <View style={styles.container}>
            <View style={styles.userArea}>
                {left ? (
                    <View style={styles.userCircle}>
                        <Text style={styles.userText}>{message.id.charAt(0)}</Text>
                    </View>
                ) : (
                    <></>
                )}
            </View>
            <View style={styles.messageArea}>
                <View style={styles.messageBox}>
                    <Text>{message.message}</Text>
                </View>
            </View>
            <View style={styles.userArea}>
                {left ? (
                    <></>
                ) : (
                    <View style={styles.userCircle}>
                        <Text style={styles.userText}>{message.id.charAt(0)}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: 'yellow',
        minHeight: 45,
        flexDirection: 'row',
    },
    userArea: {
        // flex: 1,
        width: 50,
        // backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    userCircle: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'black',
        backgroundColor: 'grey',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    messageArea: {
        flex: 1,
        backgroundColor: 'grey',
        marginTop: 5,
        // borderWidth: 1,
        // borderRadius: 6,
        justifyContent: 'center',
        // alignItems: 'center',
        // alignSelf: 'flex-start'
    },
    messageBox: {
        borderWidth: 1,
        borderRadius: 6,
        // flex: 1,
        alignSelf: 'flex-start',
    },
    bufferArea: {
        width: 50,
        backgroundColor: 'brown',
    },
});

export default Message;
