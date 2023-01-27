import * as Notifications from 'expo-notifications';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

import * as config from './config';
import { UserManager } from './models';
import { useAuthStore } from './state/auth';
import { useUserStore } from './state/user';
import { asyncHandler } from './util';

Notifications.setNotificationHandler({
    // eslint-disable-next-line @typescript-eslint/require-await
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        priority: Notifications.AndroidNotificationPriority.MAX,
    }),
});

export function useNotifications() {
    const updateBackend = useUpdateBackend();

    // create + send push token; re-runs any time the current user ID or auth token changes
    useEffect(() => {
        const inner = asyncHandler(
            async () => {
                const token = await registerForPushNotificationsAsync();
                if (token) await updateBackend(token);
            },
            { prefix: 'Failed to register push notifications' }
        );
        void inner();
    }, [updateBackend]);

    // register user action listener, will be called whenever a user taps a notification
    useEffect(() => {
        const responseListener = Notifications.addNotificationResponseReceivedListener(
            handleNotificationResponse
        );
        return () => Notifications.removeNotificationSubscription(responseListener);
    }, []);
}

/** Returns a function to call for sending push tokens to the backend */
function useUpdateBackend() {
    const userId = useUserStore((state) => state.currentUserId);
    const authToken = useAuthStore((state) => state.token);

    return useCallback(
        async (token: string) => {
            if (userId) {
                // once we're logged in, register the push token
                await UserManager.registerPush(token);
            } else if (!authToken) {
                // if we're not logged in and don't have an auth token, unregister the push token
                await UserManager.unregisterPush(token);
            }
            // else, if we're not logged in but have an auth token,
            // that means we're currently loading; in that case, do nothing
        },
        [userId, authToken]
    );
}

/** Requests notification permissions and creates an Expo notification token */
async function registerForPushNotificationsAsync(): Promise<string | null> {
    // Android requires at least one channel to be set up for notifications, otherwise the
    // permission prompt won't be shown
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Notifications',
            importance: Notifications.AndroidImportance.MAX,
        });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        console.info('notification permissions not granted');
        return null;
    }

    // Need to explicitly specify `projectId` due to https://github.com/expo/expo/issues/18570
    return (await Notifications.getExpoPushTokenAsync({ projectId: config.extra?.eas?.projectId }))
        .data;
}

/** Callback when a user taps a notification */
function handleNotificationResponse(event: Notifications.NotificationResponse) {
    // TODO: navigate somewhere depending on what type of notification the user tapped
    // https://docs.expo.dev/versions/latest/sdk/notifications/#handle-push-notifications-with-react-navigation
    console.debug('notification response', event);
}
