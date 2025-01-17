import { Cell } from 'react-native-tableview-simple';
import SearchableList from '../../components/SearchableList';
import { User, UserManager, UserResponse } from '../../models';
import { ProfileStackNavProps } from '../../nav/types';
import { useCurrentUser } from '../../state/user';
import { request } from '../../util';

export default function AdminUsersScreen({ navigation }: ProfileStackNavProps<'AdminUsersScreen'>) {
    const currentUser = useCurrentUser();

    return (
        <SearchableList<User>
            fetchItems={async () => {
                const usersResponse = (await request('GET', '/admin/user/all')) as UserResponse[];
                return usersResponse
                    .map((user) => UserManager.fromUserResponse(user))
                    .sort((user1, user2) => user1.username.localeCompare(user2.username));
            }}
            filterItems={(users, searchText) => {
                const search = searchText.toLowerCase();
                return users.filter(
                    (user) =>
                        user.username.toLowerCase().includes(search) ||
                        user.displayName.toLowerCase().includes(search)
                );
            }}
            extractItemKey={(user) => user.id}
            renderItem={({ index, item, separators }) => {
                const isCurrentUser = item.id === currentUser.id;

                return (
                    <Cell
                        title={`@${item.username}${
                            item.displayName ? `, ${item.displayName}` : ''
                        }${isCurrentUser ? ', cant edit current user' : ''}`}
                        onPress={
                            isCurrentUser
                                ? undefined
                                : () => navigation.push('AdminUserScreen', { user: item })
                        }
                        isDisabled={isCurrentUser}
                    />
                );
            }}
        />
    );
}
