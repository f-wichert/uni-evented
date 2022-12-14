import { ComponentProps } from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

interface Props {
    text: string;
    onPress: ComponentProps<typeof TouchableHighlight>['onPress'];
}

export default function Button({ text, onPress }: Props) {
    return (
        <TouchableHighlight style={styles.submitButton} onPress={onPress} underlayColor="#bc9b00">
            <Text style={styles.submitButtonText}>{text}</Text>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    submitButton: {
        paddingHorizontal: 20,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d9b611',
        borderRadius: 20,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
