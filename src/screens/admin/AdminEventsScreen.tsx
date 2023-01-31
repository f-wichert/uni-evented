import { Cell } from 'react-native-tableview-simple';
import SearchableList from '../../components/SearchableList';
import { EventManager, EventResponse } from '../../models';
import { EventExtra } from '../../models/event';
import { ProfileStackNavProps } from '../../nav/types';
import { request } from '../../util';

export default function AdminEventsScreen({
    navigation,
}: ProfileStackNavProps<'AdminEventsScreen'>) {
    return (
        <SearchableList<EventExtra>
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
