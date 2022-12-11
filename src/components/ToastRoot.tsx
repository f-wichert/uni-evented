import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { default as Toast } from 'react-native-toast-notifications';

export default function ToastRoot() {
    const insets = useSafeAreaInsets();

    return (
        <Toast
            // make `toast.show` globally available
            ref={(ref) => ref && (globalThis['toast'] = ref)}
            placement="top"
            successIcon={<Ionicons name="checkmark" color="#fff" size={18} />}
            // successColor=''
            warningIcon={<Ionicons name="warning" color="#fff" size={18} />}
            warningColor="gold"
            dangerIcon={<Ionicons name="close" color="#fff" size={18} />}
            offset={0}
            style={{
                top: insets.top,
                left: insets.left,
                right: insets.right,
                bottom: insets.bottom,
            }}
        />
    );
}
