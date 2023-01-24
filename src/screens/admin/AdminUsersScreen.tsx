import { useState } from 'react';
import { Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { User, UserManager, UserResponse } from '../../models';
import { ProfileStackNavProps } from '../../nav/types';
import { request, useAsyncEffects } from '../../util';
import LoadingScreen from '../LoadingScreen';

export default function AdminUsersScreen({ navigation }: ProfileStackNavProps<'AdminUsersScreen'>) {
    const [users, setUsers] = useState<User[]>();
    const [searchText, setSearchText] = useState<String>();

    const fetchUsers = async () => {
        const usersResponse = (await request('GET', '/admin/user/all')) as UserResponse[];
        const users = usersResponse.map((user) => UserManager.fromUserResponse(user));
        setUsers(users);
    };

    const filterUsers = () => {
        if (!users) return [];
        if (!searchText) return users;
        const search = searchText.toLowerCase();
        return users.filter((user) => {
            return (
                user.username.toLowerCase().includes(search) ||
                user.displayName.toLowerCase().includes(search)
            );
        });
    };

    useAsyncEffects(fetchUsers, []);

    return (
        <SafeAreaProvider>
            {users ? (
                <FlatList
                    data={filterUsers()}
                    renderItem={({ index, item, separators }) => {
                        return <Text>{item.username}</Text>;
                    }}
                    keyExtractor={(user) => user.id}
                />
            ) : (
                <LoadingScreen />
            )}
        </SafeAreaProvider>
    );
}
