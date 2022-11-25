import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { default as Toast } from 'react-native-toast-notifications';

export default function ToastRoot() {
    return (
        <Toast
            // make `toast.show` globally available
            ref={(ref) => ref && (globalThis['toast'] = ref)}
            placement="top"
            offset={20}
            successIcon={<Ionicons name="checkmark" color="#fff" size={18} />}
            // successColor=''
            warningIcon={<Ionicons name="warning" color="#fff" size={18} />}
            warningColor="gold"
            dangerIcon={<Ionicons name="close" color="#fff" size={18} />}
        />
    );
}
