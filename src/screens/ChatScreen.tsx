import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import Message from '../components/Message';
import { Message as MessageModel, MessageManager } from '../models/message';
import { CommonStackProps } from '../nav/types';
import { useAsyncCallback } from '../util';

function ChatScreen({ route }: CommonStackProps<'Chat'>) {
    const eventId = route.params?.eventId ?? null;
    const [messages, setMessages] = useState<MessageModel[]>();
    const [text, setText] = useState('');

    const textInputRef = useRef<TextInput | null>(null);
    const scrollViewRef = useRef<ScrollView | null>(null);

    const refreshMessages = useAsyncCallback(
        async () => {
            // TODO: scroll to end if new message added
            const data = await MessageManager.fetchMessages(eventId);
            setMessages(data);
        },
        [eventId],
        { prefix: 'Failed to load messages' }
    );

    useFocusEffect(
        useCallback(() => {
            // initial load
            refreshMessages();

            // set up continuous refresh
            const id = setInterval(refreshMessages, 1000);
            return () => clearInterval(id);
        }, [refreshMessages])
    );

    const sendMessage = useAsyncCallback(
        async () => {
            if (!text) return;
            await MessageManager.sendMessage(eventId, text);
            textInputRef.current?.clear();
            setText('');
        },
        [eventId, text, textInputRef],
        { prefix: 'Failed to send message' }
    );

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
                        {messages?.map((msg) => <Message key={msg.id} message={msg} />) ?? null}
                    </ScrollView>
                </SafeAreaView>
            </View>
            <View style={styles.menuArea}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Message..."
                    onChangeText={setText}
                    ref={textInputRef}
                />
                {/* TODO: disable button if input field empty */}
                <View style={styles.sendButton}>
                    <Ionicons
                        name="send"
                        size={25}
                        color={'#fcba03'}
                        styles={{ opacity: text ? 1 : 0.5 }}
                        onPress={() => sendMessage()}
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
