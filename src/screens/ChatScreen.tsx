import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Message from '../components/Message';
import { EventDetailProps } from '../nav/types';
import { useUserStore } from '../state/user';
import { asyncHandler, request } from '../util';

function ChatScreen({ route }: EventDetailProps<'Chat'>) {
    const eventId = route.params?.eventId ?? null;
    const userId = useUserStore((state) => state.currentUserId);
    const [messages, setMessages] = useState();
    const [text, setText] = useState();
    const textInputRef = React.createRef();

    const scrollViewRef = useRef();

    // console.log(`User: ${useUserStore((state) => state.fetchCurrentUser())}`);

    useEffect(() => {
        setMessages(getMessages());
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const id = setInterval(() => {
                const newMessages = getMessages();
                if (JSON.stringify(newMessages) === JSON.stringify(messages)) {
                    // TODO: Figure out why this is not printed but it somehow seems to work
                    console.log('new');
                    setMessages(messages);
                    // scrollRef.current.scrollToEnd({ animated: true })
                    // console.log(`Ref: ${JSON.stringify(scrollRef)}`);
                } else {
                    // console.log('old');
                }
            }, 1000);
            return () => clearInterval(id);
        }, [messages])
    );

    function getMessages() {
        // console.log('Get Messages');
        asyncHandler(
            async () => {
                const data = await request('POST', '/event/getMessages', {
                    eventId: eventId,
                });

                // console.log();
                // console.log(`Messages: ${JSON.stringify(data.messages)}`);
                setMessages(data.messages);
            },
            { prefix: 'Failed to load messages' }
        )();
    }

    function sendMessage(text: String) {
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

        // setMessages(getMessages());
    }

    return (
        <View style={styles.container}>
            <View style={styles.chatArea}>
                <SafeAreaView style={{ display: 'flex' }}>
                    <ScrollView
                        ref={scrollViewRef}
                        onContentSizeChange={() =>
                            scrollViewRef.current?.scrollToEnd({ animated: false })
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
