import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useCallback } from 'react';
import { EventStatus } from '../models';
import { EventAttendeeStatus } from '../models/user';
import { UnreachableCaseError } from '../util';

interface Props {
    loading: boolean;
    inRange: boolean;
    isHost: boolean;
    eventStatus: EventStatus;
    userStatus: EventAttendeeStatus | undefined;
    onAction: (action: EventActionState) => void;
}

export enum EventActionState {
    Completed = 'Event done.',
    HostStart = 'Start event!',
    HostEnd = 'Stop event!',
    AttendeeJoin = "I'm here!",
    AttendeeLeave = 'Leave event!',
    AttendeeInterested = "I'm interested!",
    AttendeeNotInterested = 'Not interested?',
    AttendeeBanned = 'Banned.',
}

export default function DetailActionButton({
    loading,
    inRange,
    isHost,
    eventStatus,
    userStatus,
    onAction,
}: Props) {
    let state = EventActionState.AttendeeJoin; // default/fallback state
    let disabled = loading;

    if (eventStatus === 'completed') {
        state = EventActionState.Completed;
    } else if (isHost) {
        switch (eventStatus) {
            case 'active':
                state = EventActionState.HostEnd;
                break;
            case 'scheduled':
                state = EventActionState.HostStart;
                break;
            default:
                throw new UnreachableCaseError(eventStatus);
        }
    } else {
        switch (userStatus) {
            case 'attending':
                state = EventActionState.AttendeeLeave;
                break;
            case 'interested':
                if (!inRange || eventStatus !== 'active') {
                    state = EventActionState.AttendeeNotInterested;
                    // TODO: add subtitle: `Not close enough to join (xx m)`
                }
                // else, if in range and event is active, show "I'm here"
                break;
            case 'left':
            // fallthrough
            case undefined:
                if (!inRange || eventStatus !== 'active') {
                    state = EventActionState.AttendeeInterested;
                }
                // else, if in range and event is active, show "I'm here"
                break;
            case 'banned':
                state = EventActionState.AttendeeBanned;
                break;
            default:
                throw new UnreachableCaseError(userStatus);
        }
    }

    if ([EventActionState.Completed, EventActionState.AttendeeBanned].includes(state)) {
        disabled = true;
    }

    const onButtonPress = useCallback(() => onAction(state), [onAction, state]);

    return (
        <View style={styles.joinButtonContainer}>
            <Pressable
                style={{ ...styles.joinButton, opacity: disabled ? 0.5 : 1 }}
                onPress={onButtonPress}
                disabled={disabled}
            >
                <Text style={styles.joinButtonText}>{state}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    joinButtonContainer: {
        flex: 3,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButton: {
        backgroundColor: 'black',
        borderRadius: 7,
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
    },
});
