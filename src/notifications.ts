import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { UserManager } from './models';
import { useAuthStore } from './state/auth';
import { useUserStore } from './state/user';
import { asyncHandler } from './util';

Notifications.setNotificationHandler({
    // eslint-disable-next-line @typescript-eslint/require-await
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export function useNotifications() {
    const userId = useUserStore((state) => state.currentUserId);
    const authToken = useAuthStore((state) => state.token);

    // re-runs any time the current user ID changes
    useEffect(() => {
        const inner = asyncHandler(async () => {
            const token = await registerForPushNotificationsAsync();
            if (!token) return;

            if (userId) {
                // once we're logged in, register the push token
                await UserManager.registerPush(token);
            } else if (!authToken) {
                // if we're not logged in and don't have an auth token, unregister the push token
                await UserManager.unregisterPush(token);
            }
            // else, if we're not logged in but have an auth token,
            // that means we're currently loading; in that case, do nothing
        });
        void inner();
    }, [userId, authToken]);

    useEffect(() => {
        // called whenever a user taps on a notification
        const responseListener = Notifications.addNotificationResponseReceivedListener(
            handleNotificationResponse
        );
        return () => Notifications.removeNotificationSubscription(responseListener);
    });
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        console.info('notification permissions not granted');
        return null;
    }

    return (await Notifications.getExpoPushTokenAsync()).data;
}

function handleNotificationResponse(event: Notifications.NotificationResponse) {
    // TODO: navigate somewhere depending on what type of notification the user tapped
    console.debug('notification response', event);
}
