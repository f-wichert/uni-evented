import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import UserPreview from '../components/UserPreview';
import { EventDetailProps } from '../nav/types';
import { useEventFetch } from '../state/event';
import { useCurrentUser } from '../state/user';

interface Props extends EventDetailProps<'EventAttendees'> {}

function EventAttendees({ navigation, route }: Props) {
    const eventId = route.params.eventId;
    const { event, loading, refresh } = useEventFetch(eventId);

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

    const hostId = event.hostId;
    const currentUser = useCurrentUser();

    return (
        <>
            {/* always show the host first - sorting also works here *shrug* */}
            {event?.users
                ?.filter((el) => el.id === hostId)
                .map((user) => (
                    <UserPreview
                        username={user.username}
                        // avatarhash={user.avatarHash}
                        displayName={user.displayName}
                        id={user.id}
                        bio={user.bio}
                        status={user.eventAttendee?.status}
                        host={true}
                        ban={false}
                    />
                ))}
            {event?.users
                ?.filter((el) => el.id !== hostId)
                .filter(
                    (el) =>
                        el.eventAttendee?.status === 'interested' ||
                        el.eventAttendee?.status === 'attending' ||
                        el.eventAttendee?.status === 'left'
                )
                .map((user) => (
                    <UserPreview
                        username={user.username}
                        // avatarhash={user.avatarHash}
                        displayName={user.displayName}
                        id={user.id}
                        bio={user.bio}
                        status={user.eventAttendee?.status}
                        host={false}
                        ban={hostId === currentUser.id}
                    />
                ))}
        </>
    );
}

const styles = StyleSheet.create({});

export default EventAttendees;
