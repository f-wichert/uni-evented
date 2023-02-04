import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import UserPreview from '../components/UserPreview';
import { UserManager } from '../models';
import { CommonStackProps } from '../nav/types';
import { useUser } from '../state/user';
import { useAsync } from '../util';

export default function FollowList({ navigation, route }: CommonStackProps<'FollowList'>) {
    const userId = route.params.userId;
    const type = route.params.type;

    const fetch = useCallback(async () => {
        return await UserManager.fetchFollows(userId, type);
    }, [userId, type]);
    const { value: users, loading, refresh } = useAsync(fetch);

    // show username in title
    const username = useUser(userId)?.username;
    const typeName = { following: 'followed users', followers: 'followers' }[type];
    useEffect(() => {
        navigation.setOptions({
            title: username
                ? `${username}'s ${typeName}`
                : typeName
                      .split(' ')
                      .map((n) => _.capitalize(n))
                      .join(' '),
        });
    }, [navigation, username, typeName]);

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}>
            {users?.map((user) => {
                const avatarUrl = UserManager.getAvatarUrl(user);
                return (
                    <UserPreview
                        key={user.id}
                        username={user.username}
                        displayName={user.displayName}
                        id={user.id}
                        bio={user.bio}
                        avatarUrl={avatarUrl}
                        navigation={navigation}
                    />
                );
            })}
        </ScrollView>
    );
}
