import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import yellowSplash from '../../assets/yellow_splash.png';
import { UserManager } from '../models';
import { Message as MessageModel } from '../models/message';
import { useUserStore } from '../state/user';
import { mergeStyleSheets } from '../util';

interface Props {
    message: MessageModel;
    showProfile: (userId: string) => void;
}

function Message({ message, showProfile }: Props) {
    const myId = useUserStore((state) => state.currentUserId);
    const senderId = message.sender.id;

    const avatarUrl = UserManager.getAvatarUrl(message.sender);
    const username = message.sender.displayName || message.sender.username;

    const formattedTime = dayjs(message.sendTime).format('HH:mm');

    const _styles = senderId === myId ? rightStyles : styles;

    const showUserProfile = useCallback(() => showProfile(senderId), [showProfile, senderId]);

    const userView = (
        <TouchableOpacity style={_styles.userArea} onPress={showUserProfile}>
            <Image
                style={_styles.userIcon}
                source={avatarUrl ? { uri: avatarUrl } : yellowSplash}
            />
        </TouchableOpacity>
    );

    const messageView = (
        <View style={_styles.messageArea}>
            <Text style={_styles.time}>
                {username} &ndash; {formattedTime}
            </Text>
            <View style={_styles.message}>
                <Text>{message.message}</Text>
            </View>
        </View>
    );

    return (
        <View style={_styles.container}>
            {userView}
            {messageView}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 45,
        flexDirection: 'row',
    },
    userArea: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    messageArea: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 5,
    },
    time: {
        fontSize: 10,
        marginVertical: 4,
    },
    message: {
        borderRadius: 6,
        paddingHorizontal: 13,
        paddingVertical: 4,
        elevation: 6.5,
        shadowColor: '#71717',
        backgroundColor: '#ebe9e4',
        maxWidth: '70%',
    },
    userIcon: {
        width: 35,
        height: 35,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white',
    },
});

const rightStyles = mergeStyleSheets(styles, {
    container: {
        flexDirection: 'row-reverse',
    },
    messageArea: {
        alignItems: 'flex-end',
    },
    message: {
        backgroundColor: '#fcba03',
    },
});

export default Message;
