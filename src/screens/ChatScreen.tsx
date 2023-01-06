import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Message from '../components/Message';

function ChatScreen({ route, navigation }) {
    const eventId = route.params?.eventId ?? null;
    const [messages, setMessages] = useState(getMessages());
    const [text, setText] = useState();
    const textInputRef = React.createRef();

    function getMessages() {
        return [
            {
                message: 'Hi, wie sieht das event so aus?',
                messageCorrespondant: 'Lorenzo',
            },
            {
                message: 'Cool things!',
                messageCorrespondant: 'Fred',
            },
            {
                message:
                    'Hey, I am glad that you will join us. Wir legen so gegen 15 Uhr los denke ich? Und dann geht die Party ab. Whoop, whoop!! Lov u <3',
                messageCorrespondant: 'Jonas',
            },
            {
                message: 'Cool',
                messageCorrespondant: 'Lorenzo',
            },
        ];
    }

    function sendMessage(text: String) {
        setMessages([
            ...messages,
            {
                message: text,
                messageCorrespondant: 'Lorenzo',
            },
        ]);

        // asyncHandler(async () => {
        //     const data = await request('POST', '/event/sendMessage', getToken(), {
        //         eventId: '-',
        //         messageContent: text
        //     });
        // });
    }

    return (
        <View style={styles.container}>
            <View style={styles.chatArea}>
                <SafeAreaView style={{ display: 'flex' }}>
                    <ScrollView>
                        {messages.map((e, i) => (
                            <Message key={`message-${i}`} message={messages[i]} />
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </View>
            <View style={styles.menuArea}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Message..."
                    onChangeText={(t) => {
                        setText(t);
                    }}
                    ref={textInputRef}
                />
                <View style={styles.sendButton}>
                    <Ionicons
                        name="send-outline"
                        size={25}
                        onPress={() => {
                            sendMessage(text);
                            textInputRef.current.clear();
                        }}
                    ></Ionicons>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatArea: {
        flex: 1,
        // backgroundColor: 'red'
    },
    menuArea: {
        height: 65,
        // backgroundColor: 'blue'
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    textInput: {
        height: 40,
        // width: '80%',
        flex: 1,
        marginLeft: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 8,
    },
    sendButton: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
