import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUserStore } from '../state/user';

function Message(props) {
    const message = props.message;
    const userId = useUserStore((state) => state.currentUserId);
    const left = props.message.senderId == userId;

    const nameChar = (message.sender.displayName || message.sender.username)
        .charAt(0)
        .toUpperCase();

    return (
        <>
            {left == false ? (
                <View style={styles.container}>
                    <View style={styles.userArea}>
                        <View style={styles.userCircle}>
                            <Text style={styles.userText}>{nameChar}</Text>
                        </View>
                    </View>
                    <View style={styles.messageArea}>
                        <View
                            style={{
                                ...styles.messageBox,
                                ...styles.elevation,
                                alignSelf: 'flex-start',
                                backgroundColor: '#ebe9e4',
                            }}
                        >
                            <Text>{message.message}</Text>
                        </View>
                    </View>
                    <View style={styles.userArea}></View>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.userArea}></View>
                    <View style={styles.messageArea}>
                        <View
                            style={{
                                ...styles.messageBox,
                                ...styles.elevation,
                                alignSelf: 'flex-end',
                                backgroundColor: '#fcba03',
                            }}
                        >
                            <View>
                                <Text>{message.message}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.userArea}>
                        <View style={styles.userCircle}>
                            <Text style={styles.userText}>{nameChar}</Text>
                        </View>
                    </View>
                </View>
            )}
        </>
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
        // alignSelf: 'flex-start
    },
    messageBox: {
        // borderWidth: 1,
        borderRadius: 6,
        // flex: 1,
        alignSelf: 'flex-start',
        paddingHorizontal: 13,
        paddingVertical: 4,
    },
    bufferArea: {
        width: 50,
        backgroundColor: 'brown',
    },
    elevation: {
        elevation: 6.5,
        shadowColor: '#71717',
    },
});

export default Message;
