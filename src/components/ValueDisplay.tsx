import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { abbreviateNumber } from '../util';

interface ValueDisplayProps {
    value: number;
    name: string;
    onPress?: () => void;
}

export default function ValueDisplay({ value, name, onPress }: ValueDisplayProps) {
    const formattedValue = abbreviateNumber(value);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
            <Text style={styles.value}>{formattedValue}</Text>
            <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
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
