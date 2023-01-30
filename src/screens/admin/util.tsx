import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { IoniconsName } from '../../types';

export function confirmationAlert(title: string, message: string, onConfirm: () => void) {
    Alert.alert(title, message, [
        {
            text: 'Cancel',
            style: 'cancel',
        },
        {
            text: 'Confirm',
            style: 'destructive',
            onPress: onConfirm,
        },
    ]);
}

export function getCellIcon(name: IoniconsName, color?: string) {
    return <Ionicons name={name} size={27} color={color} />;
}
