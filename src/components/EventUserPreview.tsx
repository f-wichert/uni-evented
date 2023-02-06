import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { EventManager } from '../models';
import { EventAttendeeStatus } from '../models/user';
import { IoniconsName } from '../types';
import { confirmationAlert, useAsyncCallback } from '../util';
import UserPreview from './UserPreview';

type BaseProps = Omit<ComponentProps<typeof UserPreview>, 'children'>;

declare type Props = BaseProps & {
    status?: EventAttendeeStatus;
    host: boolean;
    ban: boolean;
    eventId: string;
    refresh: () => void;
};

export default function EventUserPreview({
    id,
    status,
    host,
    ban,
    eventId,
    refresh,
    ...props
}: Props) {
    const { username } = props;
    const banUser = useAsyncCallback(
        async () => {
            await EventManager.banUser(eventId, id);
            refresh();
        },
        [eventId, id, refresh],
        { prefix: 'Failed to ban user' }
    );
    const onBanPress = useCallback(() => {
        confirmationAlert(
            'Confirm Ban',
            `Are you sure you want to ban @${username} from this event?`,
            banUser
        );
    }, [username, banUser]);

    let statusIcon: IoniconsName | null = null;
    if (host) statusIcon = 'home-outline';
    else
        switch (status) {
            case 'attending':
                statusIcon = 'checkmark-circle-outline';
                break;
            case 'interested':
                statusIcon = 'help-outline';
                break;
            case 'left':
                statusIcon = 'close-circle-outline';
                break;
        }

    return (
        <UserPreview id={id} {...props}>
            <View style={styles.container}>
                {ban && !host ? (
                    <TouchableOpacity style={styles.statusIcon} onPress={onBanPress}>
                        <Ionicons name="close-circle-outline" color={'red'} size={32} />
                    </TouchableOpacity>
                ) : null}
                {statusIcon ? (
                    <Ionicons
                        style={styles.statusIcon}
                        name={statusIcon}
                        color={'black'}
                        size={32}
                    />
                ) : null}
            </View>
        </UserPreview>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    statusIcon: {
        marginLeft: 'auto',
        marginRight: 10,
    },
});
