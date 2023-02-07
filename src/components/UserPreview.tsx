import Ionicons from '@expo/vector-icons/Ionicons';
import React, { ReactNode, useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CommonStackProps } from '../nav/types';

declare type Props = {
    id: string;
    username: string;
    displayName: string;
    bio: string;
    avatarUrl: string | null;

    navigation: CommonStackProps['navigation'];
    children?: ReactNode;
};

function UserPreview({ id, username, displayName, bio, avatarUrl, navigation, children }: Props) {
    const showProfile = useCallback(
        () => navigation.push('UserProfile', { userId: id }),
        [navigation, id]
    );

    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.innerContainer]} onPress={showProfile}>
                {avatarUrl ? (
                    <Image style={styles.icon} source={{ uri: avatarUrl }} />
                ) : (
                    <Ionicons
                        style={[styles.icon, { height: 32 }]}
                        name="person-outline"
                        color="#000"
                        size={32}
                    />
                )}
                <View style={[styles.textContainer]}>
                    <Text style={[styles.title]}>{displayName ? displayName : username}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail">
                        {bio}
                    </Text>
                </View>
            </TouchableOpacity>
            <View>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 5,
    },
    innerContainer: {
        flex: 1,
        flexGrow: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    icon: {
        margin: 5,
        width: 40,
        height: 40,
        borderRadius: 50,
        textAlign: 'center',
    },
    statusIcon: {
        marginLeft: 'auto',
        marginRight: 10,
    },
});

export default UserPreview;
