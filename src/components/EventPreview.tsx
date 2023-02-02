import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EventStatus } from '../models';

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

    if (filter && !filter.includes(event.status)) {
        return <></>;
    }

    return (
        <TouchableOpacity style={[styles.container]} onPress={navigate}>
            <Ionicons style={[styles.icon]} name="rocket-outline" color="#000" size={32} />
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
    },
});

export default EventPreview;
