import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { abbreviateNumber } from '../util';

interface ValueDisplayProps {
    value: number | undefined;
    name: string;
    onPress?: () => void;
}

export default function ValueDisplay({ value, name, onPress }: ValueDisplayProps) {
    let valueNode: ReactNode;
    if (value !== undefined) {
        valueNode = <Text style={styles.value}>{abbreviateNumber(value)}</Text>;
    } else {
        valueNode = <ActivityIndicator size="small" />;
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
            {valueNode}
            <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 12,
        color: 'grey',
    },
});
