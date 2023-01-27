import { Cell } from 'react-native-tableview-simple';
import SearchableList from '../../components/SearchableList';
import { Event, EventManager, EventResponse } from '../../models';
import { ProfileStackNavProps } from '../../nav/types';
import { request } from '../../util';

export default function AdminEventsScreen({
    navigation,
}: ProfileStackNavProps<'AdminEventsScreen'>) {
    return (
        <SearchableList<Event>
            fetchItems={async () => {
                const eventsResponse = (await request(
                    'GET',
                    '/admin/event/all'
                )) as EventResponse[];
                return eventsResponse.map((event) => EventManager.fromEventResponse(event));
            }}
            filterItems={(events, searchText) => {
                const search = searchText.toLowerCase();
                return events.filter((event) => {
                    return event.name.toLowerCase().includes(search);
                });
            }}
            extractItemKey={(event) => event.id}
            renderItem={({ index, item, separators }) => {
                return (
                    <Cell
                        title={`${item.name}`}
                        onPress={() => {
                            navigation.navigate('AdminEventScreen', { event: item });
                        }}
                    />
                );
            }}
        />
    );
}
