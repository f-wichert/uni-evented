import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function Message(props) {
    const message = props.message;
    var left = props.message.messageCorrespondant == 'Lorenzo' ? true : false;

    return (
        <View style={styles.container}>
            <View style={styles.userArea}>
                {left ? (
                    <View style={styles.userCircle}>
                        <Text style={styles.userText}>
                            {message.messageCorrespondant.charAt(0)}
                        </Text>
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
                        <Text style={styles.userText}>
                            {message.messageCorrespondant.charAt(0)}
                        </Text>
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
        // backgroundColor: 'grey',
        marginTop: 5,
        // borderWidth: 1,
        // borderRadius: 6,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    messageBox: {
        borderWidth: 1,
        borderRadius: 6,
        // flex: 1,
        alignSelf: 'stretch',
    },
    bufferArea: {
        width: 50,
        backgroundColor: 'brown',
    },
});

export default Message;
