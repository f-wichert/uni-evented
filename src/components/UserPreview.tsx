import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

declare type Props = {
    id: string;
    username: string;
    // avatarhash: string;
    displayName: string;
    bio: string;
    status?: string;
    host: boolean;
    ban: boolean;
};

function UserPreview({ id, username, displayName, status, bio, host, ban }: Props) {
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

    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.container]}>
                <Ionicons style={[styles.icon]} name="person-outline" color="#000" size={32} />
                <View style={[styles.innerContainer]}>
                    <Text style={[styles.title]}>{displayName ? displayName : username}</Text>
                    <Text>{bio?.slice(0, 40) + '...'}</Text>
                </View>
            </TouchableOpacity>
            {ban ? (
                <TouchableOpacity
                    style={styles.statusIcon}
                    // ToDo: add ban user endpoint
                    onPress={() => {}}
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
    },
    statusIcon: {
        marginLeft: 'auto',
        marginRight: 10,
    },
});

export default UserPreview;
