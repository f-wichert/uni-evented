import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import Message from '../components/Message';
import { useUserStore } from '../state/user';
import { asyncHandler, request } from '../util';

function ChatScreen({ route, navigation }) {
    const eventId = route.params?.eventId ?? null;
    const userId = useUserStore((state) => state.currentUserId);
    const [messages, setMessages] = useState();
    const [loading, setLoading] = useState<boolean>(false);
    const [text, setText] = useState();
    const textInputRef = React.createRef();

    // console.log(`User: ${useUserStore((state) => state.fetchCurrentUser())}`);

    useEffect(() => {
        setMessages(getMessages());
    }, []);

    function getMessages() {
        console.log('Get Messages');
        asyncHandler(
            async () => {
                setLoading(true);
                const data = await request('POST', '/event/getMessages', {
                    eventId: eventId,
                });

                console.log();
                console.log(`Messages: ${JSON.stringify(data.messages)}`);
                setMessages(data.messages);
                setLoading(false);
            },
            { prefix: 'Failed to load messages' }
        )();
    }

    function sendMessage(text: String) {
        // if (messages) {
        //     setMessages([
        //         ...messages,
        //         {
        //             message: text,
        //             messageCorrespondent: userId,
        //         },
        //     ]);
        // } else {
        //     setMessages([
        //         {
        //             message: text,
        //             messageCorrespondent: userId,
        //         },
        //     ]);
        // }

        asyncHandler(
            async () => {
                console.log('Message sent');

                const data = await request('POST', '/event/sendMessage', {
                    eventId: eventId,
                    messageContent: text,
                });
            },
            { prefix: 'Failed to do stuff' }
        )();

        setMessages(getMessages());
    }

    return (
        <View style={styles.container}>
            <View style={styles.chatArea}>
                <SafeAreaView style={{ display: 'flex' }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={getMessages} />
                        }
                    >
                        {messages ? (
                            messages.map((e, i) => (
                                <Message key={`message-${i}`} message={messages[i]} />
                            ))
                        ) : (
                            <></>
                        )}
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
                        name="send"
                        size={25}
                        color={'#fcba03'}
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
        backgroundColor: 'white',
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
        // borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
