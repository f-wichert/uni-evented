import { ComponentProps } from 'react';
import { StyleProp, StyleSheet, Text, TouchableHighlight, View, ViewStyle } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { IoniconsName } from '../types';

interface Props {
    text: string;
    onPress?: ComponentProps<typeof TouchableHighlight>['onPress'];

    style?: StyleProp<ViewStyle>;
    icon?: IoniconsName;
    disabled?: boolean;
}

// TODO: rename to something more descriptive
export default function Button({ text, onPress, style, icon, disabled }: Props) {
    return (
        <TouchableHighlight
            style={[styles.container, style, disabled ? styles.containerDisabled : null]}
            onPress={onPress}
            underlayColor="#bc9b00"
            disabled={disabled}
        >
            <View style={styles.inner}>
                {icon ? <Ionicons name={icon} size={18} style={styles.icon} /> : null}
                <Text style={styles.submitButtonText}>{text}</Text>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 14,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0c440',
        borderRadius: 20,
    },
    containerDisabled: {
        opacity: 0.4,
    },

    inner: {
        flexDirection: 'row',
    },

    icon: {
        marginRight: 4,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
