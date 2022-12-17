import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

declare type Props = {
    name: string;
    id: string;
    navigateDetail: (id: string) => void;
};

function EventPreview({ name, id, navigateDetail }: Props) {
    return (
        <TouchableOpacity style={[styles.container]} onPress={() => navigateDetail(id)}>
            <Ionicons style={[styles.icon]} name="rocket-outline" color="#000" size={32} />
            <View style={[styles.innerContainer]}>
                <Text style={[styles.title]}>{name}</Text>
                <Text>Your description can be here!</Text>
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
    },
    innerContainer: {
        display: 'flex',
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
