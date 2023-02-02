import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EventStatus } from '../models';

import yellowSplash from '../../assets/yellow_splash.png';
import { UserManager } from '../models';
import { useEvent } from '../state/event';

declare type Props = {
    id: string;
    navigateDetail: (id: string) => void;
    filter?: EventStatus[];
};

function EventPreview({ id, navigateDetail, filter }: Props) {
    const navigate = useCallback(() => navigateDetail(id), [navigateDetail, id]);
    const event = useEvent(id);

    if (!event) {
        // this shouldn't happen
        console.warn(`Tried to render unknown event ${id}`);
        return <View />;
    }

    const hostAvatarUrl = UserManager.getAvatarUrl(event.host);

    if (filter && !filter.includes(event.status)) {
        return <></>;
    }

    return (
        <TouchableOpacity style={[styles.container]} onPress={navigate}>
            <Image
                style={styles.icon}
                source={hostAvatarUrl ? { uri: hostAvatarUrl } : yellowSplash}
            />
            <View style={[styles.innerContainer]}>
                <Text style={[styles.title]}>{event.name}</Text>
                <Text numberOfLines={2} ellipsizeMode="tail">
                    {event.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 5,
        marginRight: 10,
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    icon: {
        margin: 5,
        width: 35,
        height: 35,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'black',
    },
});

export default EventPreview;
