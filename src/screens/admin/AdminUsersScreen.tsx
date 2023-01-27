import { Cell } from 'react-native-tableview-simple';
import SearchableList from '../../components/SearchableList';
import { User, UserManager, UserResponse } from '../../models';
import { ProfileStackNavProps } from '../../nav/types';
import { request } from '../../util';

export default function AdminUsersScreen({ navigation }: ProfileStackNavProps<'AdminUsersScreen'>) {
    return (
        <SearchableList<User>
            fetchItems={async () => {
                const usersResponse = (await request('GET', '/admin/user/all')) as UserResponse[];
                return usersResponse.map((user) => UserManager.fromUserResponse(user));
            }}
            filterItems={(users, searchText) => {
                const search = searchText.toLowerCase();
                return users.filter((user) => {
                    return (
                        user.username.toLowerCase().includes(search) ||
                        user.displayName.toLowerCase().includes(search)
                    );
                });
            }}
            extractItemKey={(user) => user.id}
            renderItem={({ index, item, separators }) => {
                return (
                    <Cell
                        title={`@${item.username}${
                            item.displayName ? `, ${item.displayName}` : ''
                        }`}
                        onPress={() => {
                            navigation.navigate('AdminUserScreen', { user: item });
                        }}
                    />
                );
            }}
        />
    );
}
