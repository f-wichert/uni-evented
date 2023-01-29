import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import UserPreview from '../components/UserPreview';
import { UserManager } from '../models';
import { CommonStackProps } from '../nav/types';
import { useEventFetch } from '../state/event';
import { useCurrentUser } from '../state/user';

function EventAttendees({ navigation, route }: CommonStackProps<'EventAttendees'>) {
    const eventId = route.params.eventId;
    const { event, loading } = useEventFetch(eventId);

    const currentUser = useCurrentUser();

    // always show host first
    const sortedUsers = useMemo(() => {
        if (!event?.users) return [];
        return [...event.users]
            .sort((a, b) => {
                if (a.id === event.hostId) return -1;
                if (b.id === event.hostId) return 1;
                return 0;
            })
            .filter((user) =>
                ['interested', 'attending', 'left'].includes(user.eventAttendee?.status ?? '')
            );
    }, [event]);

    const showProfile = useCallback(
        (userId: string) => {
            navigation.navigate('UserProfile', { userId: userId });
        },
        [navigation]
    );

    // is event data is not there yet
    if (!event || loading) {
        return (
            <>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            </>
        );
    }

    return (
        <>
            {sortedUsers.map((user) => {
                const avatarUrl = UserManager.getAvatarUrl(user);
                return (
                    <UserPreview
                        key={user.id}
                        username={user.username}
                        displayName={user.displayName}
                        id={user.id}
                        bio={user.bio}
                        status={user.eventAttendee?.status}
                        avatarUrl={avatarUrl}
                        host={event.hostId === user.id}
                        ban={event.hostId === currentUser.id}
                        showProfile={showProfile}
                    />
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({});

export default EventAttendees;
