import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EventManager } from '../models';

import { EventAttendeeStatus } from '../models/user';

declare type Props = {
    id: string;
    username: string;
    displayName: string;
    bio: string;
    status?: EventAttendeeStatus;
    avatarUrl: string | null;
    host: boolean;
    ban: boolean;
    showProfile: (userId: string) => void;
    eventId: string;
    refresh: () => void;
};

function UserPreview({
    id,
    username,
    displayName,
    status,
    bio,
    avatarUrl,
    host,
    ban,
    showProfile,
    eventId,
    refresh,
}: Props) {
    const statusIcon = () => {
        if (host) return 'home-outline';
        switch (status) {
            case 'attending':
                return 'checkmark-circle-outline';
            case 'interested':
                return 'help-outline';
            case 'left':
                return 'close-circle-outline';
        }
    };

    const showUserProfile = useCallback(() => showProfile(id), [showProfile, id]);

    const banUser = async () => {
        await EventManager.banUser(eventId, id);
        refresh();
    };

    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.container]} onPress={showUserProfile}>
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
                <View style={[styles.innerContainer]}>
                    <Text style={[styles.title]}>{displayName ? displayName : username}</Text>
                    <Text>{bio?.slice(0, 40) + '...'}</Text>
                </View>
            </TouchableOpacity>
            {ban && !host ? (
                <TouchableOpacity
                    style={styles.statusIcon}
                    // ToDo: add ban user endpoint
                    onPress={banUser}
                >
                    <Ionicons name="close-circle-outline" color={'red'} size={32} />
                </TouchableOpacity>
            ) : null}
            <Ionicons style={styles.statusIcon} name={statusIcon()} color={'black'} size={32} />
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
        // borderBottomColor: 'black',
        // paddingBottom: 2,
        // borderBottomWidth: 1,
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: 5,
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
