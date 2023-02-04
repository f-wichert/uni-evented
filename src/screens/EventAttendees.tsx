import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import EventUserPreview from '../components/EventUserPreview';
import { UserManager } from '../models';
import { CommonStackProps } from '../nav/types';
import { useEventFetch } from '../state/event';
import { useCurrentUser } from '../state/user';

function EventAttendees({ navigation, route }: CommonStackProps<'EventAttendees'>) {
    const eventId = route.params.eventId;
    const { event, loading, refresh } = useEventFetch(eventId);

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

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}>
            {event
                ? sortedUsers.map((user) => {
                      const avatarUrl = UserManager.getAvatarUrl(user);
                      return (
                          <EventUserPreview
                              key={user.id}
                              username={user.username}
                              displayName={user.displayName}
                              id={user.id}
                              bio={user.bio}
                              avatarUrl={avatarUrl}
                              navigation={navigation}
                              status={user.eventAttendee?.status}
                              host={event.hostId === user.id}
                              ban={event.hostId === currentUser.id}
                              eventId={event.id}
                              refresh={refresh}
                          />
                      );
                  })
                : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({});

export default EventAttendees;
