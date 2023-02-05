import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { ListRenderItem, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    MaterialTabBar,
    MaterialTabItem,
    MaterialTabItemProps,
    TabBarProps,
    Tabs,
} from 'react-native-collapsible-tab-view';

import yellowSplash from '../../assets/yellow_splash.png';
import Button from '../components/Button';
import EventPreview from '../components/EventPreview';
import ProfileHeader from '../components/ProfileHeader';
import ValueDisplay from '../components/ValueDisplay';
import { User, UserManager } from '../models';
import { UserDetails } from '../models/user';
import { CommonStackProps, ProfileStackNavProps } from '../nav/types';
import { useRelevantEvents } from '../state/event';
import { useCurrentUser, useUserFetch } from '../state/user';
import { identity } from '../util';

interface MainViewProps {
    user: User;
    details: UserDetails | undefined;
    detailsLoading: boolean;
    navigation: CommonStackProps<'UserProfile'>['navigation'];
}

function MainView({ user, details, detailsLoading, navigation }: MainViewProps) {
    const showFollowing = useCallback(
        () => navigation.navigate('FollowList', { userId: user.id, type: 'following' }),
        [user.id, navigation]
    );
    const showFollowers = useCallback(
        () => navigation.navigate('FollowList', { userId: user.id, type: 'followers' }),
        [user.id, navigation]
    );

    const currentUser = useCurrentUser();
    const canFollow = currentUser.id !== user.id;
    // whether the current user is following `user`
    const followed = details?.followed;

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <ProfileHeader
                    imageUri={UserManager.getAvatarUrl(user)}
                    displayName={user.displayName}
                    username={user.username}
                    // TODO: better fallback image
                    fallbackImage={yellowSplash}
                    compact
                />
            </View>

            {user.bio ? (
                <View style={styles.bio}>
                    <Text>{user.bio}</Text>
                </View>
            ) : null}

            <View style={styles.values}>
                <ValueDisplay
                    value={details?.numFollowing}
                    name="Following"
                    onPress={showFollowing}
                />
                <ValueDisplay
                    value={details?.numFollowers}
                    name="Followers"
                    onPress={showFollowers}
                />
                <ValueDisplay value={details?.numEvents} name="Events" />
            </View>

            {canFollow ? (
                <View style={styles.followButton}>
                    <Button
                        text={followed ? 'Unfollow' : 'Follow'}
                        icon={followed ? 'person-remove' : 'person-add'}
                        loading={detailsLoading}
                    />
                </View>
            ) : null}
        </View>
    );
}

type TabName = string | number;

/**
 * Doing somewhat cursed things here since the tab view library doesn't really
 * support tab item customization.
 * We want to pass a number from the `<Tabs.Tab />` call below to `TabLabel`,
 * and do so by passing it through the `label` prop, which is a string.
 * `MaterialTabItem.label` is also meant to be a string, but arbitrary elements work fine.
 */
function TabLabel({ name, label, ...props }: MaterialTabItemProps<TabName>) {
    const num = parseInt(label);

    const labelComponent = (
        <View style={styles.tabLabel}>
            <Text style={styles.tabLabelText}>{name}</Text>
            {!isNaN(num) ? (
                <View style={styles.tabLabelNumber}>
                    <Text style={styles.tabLabelNumberText}>{num}</Text>
                </View>
            ) : null}
        </View>
    );

    return (
        <MaterialTabItem
            {...props}
            name={name}
            // this is meant to only accept strings, but arbitrary elements technically work fine too
            label={labelComponent as unknown as string}
        />
    );
}

export default function UserProfileScreen({ navigation, route }: CommonStackProps<'UserProfile'>) {
    const showEdit = route.params.showEdit ?? false;
    const userId = route.params.userId;

    const {
        user,
        details,
        loading: userLoading,
        refresh: refreshUser,
    } = useUserFetch(userId, true);
    const {
        value: events,
        loading: detailsLoading,
        refresh: refreshEvents,
    } = useRelevantEvents(userId);

    const refresh = useCallback(() => {
        refreshUser();
        refreshEvents();
    }, [refreshUser, refreshEvents]);

    useFocusEffect(useCallback(() => void refresh(), [refresh]));

    // show edit header button if needed
    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                showEdit ? (
                    <Ionicons
                        name="create-outline"
                        size={32}
                        color="black"
                        onPress={() =>
                            (navigation as ProfileStackNavProps['navigation']).navigate(
                                'EditProfile'
                            )
                        }
                    />
                ) : null,
        });
    }, [navigation, showEdit]);

    // show username in title
    const username = user?.username;
    useEffect(() => {
        navigation.setOptions({
            title: username ? `${username}'s Profile` : 'User Profile',
        });
    }, [navigation, username]);

    const navigateDetail = useCallback(
        (id: string) => navigation.navigate('EventDetail', { eventId: id }),
        [navigation]
    );

    const renderMain = useCallback(
        () =>
            user ? (
                <MainView
                    user={user}
                    details={details ?? undefined}
                    detailsLoading={detailsLoading}
                    navigation={navigation}
                />
            ) : (
                <View style={styles.mainEmpty} />
            ),
        [user, details, detailsLoading, navigation]
    );
    const renderTabBar = useCallback(
        (props: TabBarProps<TabName>) => <MaterialTabBar TabItemComponent={TabLabel} {...props} />,
        []
    );

    const renderEventItem: ListRenderItem<string> = useCallback(
        ({ item }) => <EventPreview id={item} navigateDetail={navigateDetail} />,
        [navigateDetail]
    );

    return (
        <ScrollView
            nestedScrollEnabled
            contentContainerStyle={{
                height: '100%',
            }}
            refreshControl={<RefreshControl refreshing={userLoading} onRefresh={refresh} />}
        >
            <Tabs.Container renderHeader={renderMain} renderTabBar={renderTabBar}>
                {/* see comment further above */}
                <Tabs.Tab name="Hosted Events" label={events?.hostedEvents.length.toString()}>
                    <Tabs.FlatList
                        data={events?.hostedEvents}
                        renderItem={renderEventItem}
                        keyExtractor={identity}
                        nestedScrollEnabled
                    />
                </Tabs.Tab>
                {/* TODO: rename this tab? can't think of a better name */}
                <Tabs.Tab name="Interested" label={events?.interestedEvents.length.toString()}>
                    <Tabs.FlatList
                        data={events?.interestedEvents}
                        renderItem={renderEventItem}
                        keyExtractor={identity}
                        nestedScrollEnabled
                    />
                </Tabs.Tab>
                <Tabs.Tab name="Visited Events" label={events?.pastEvents.length.toString()}>
                    <Tabs.FlatList
                        data={events?.pastEvents}
                        renderItem={renderEventItem}
                        keyExtractor={identity}
                        nestedScrollEnabled
                    />
                </Tabs.Tab>
            </Tabs.Container>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 8,
        marginBottom: 16,
        backgroundColor: 'white',
    },

    mainEmpty: {
        height: 200,
    },

    profileHeader: {
        marginHorizontal: '5%',
    },

    bio: {
        marginHorizontal: '5%',
        marginTop: 10,
    },

    values: {
        marginTop: 20,
        marginHorizontal: '15%',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    followButton: {
        alignSelf: 'center',
        marginTop: 10,
    },

    tabLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabLabelText: {
        textTransform: 'uppercase',
    },
    tabLabelNumber: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginLeft: 8,
        borderRadius: 8,
        backgroundColor: 'lightgrey',
    },
    tabLabelNumberText: {
        fontSize: 10,
    },
});
