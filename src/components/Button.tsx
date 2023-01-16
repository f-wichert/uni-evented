import { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { IoniconsName } from '../types';

interface Props {
    text: string;
    onPress?: ComponentProps<typeof TouchableHighlight>['onPress'];

    icon?: IoniconsName;
    disabled?: boolean;
    loading?: boolean;
}

// TODO: rename to something more descriptive
export default function Button({ text, onPress, icon, disabled, loading }: Props) {
    disabled = disabled || loading;

    return (
        <View style={styles.root}>
            <TouchableHighlight
                style={[styles.container, disabled ? styles.containerDisabled : null]}
                onPress={onPress}
                underlayColor="#bc9b00"
                disabled={disabled}
            >
                <View style={styles.inner}>
                    {icon ? <Ionicons name={icon} size={18} style={styles.icon} /> : null}
                    <Text style={styles.submitButtonText}>{text}</Text>
                </View>
            </TouchableHighlight>
            {loading ? (
                <View style={styles.indicator}>
                    <ActivityIndicator />
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        height: 34,
    },
    container: {
        height: '100%',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7d738',
        borderRadius: 16,
    },
    containerDisabled: {
        opacity: 0.3,
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

    indicator: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
