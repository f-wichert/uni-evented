import { Cell } from 'react-native-tableview-simple';
import SearchableList from '../../components/SearchableList';
import { Media, MediaManager, MediaResponse } from '../../models';
import { ProfileStackNavProps } from '../../nav/types';
import { getCellIcon, request } from '../../util';

export default function AdminEventMediasScreen({
    navigation,
    route,
}: ProfileStackNavProps<'AdminEventMediasScreen'>) {
    return (
        <SearchableList<Media>
            fetchItems={async () => {
                const mediaResponse = (await request(
                    'GET',
                    `/admin/event/media/${route.params.eventId}`
                )) as MediaResponse[];
                return mediaResponse.map((media) => MediaManager.fromMediaResponse(media));
            }}
            extractItemKey={(media) => media.id}
            renderItem={({ index, item, separators }) => {
                let image;
                switch (item.type) {
                    case 'image':
                        image = getCellIcon('image-outline');
                        break;
                    case 'video':
                        image = getCellIcon('videocam-outline');
                        break;
                    case 'livestream':
                        image = getCellIcon('videocam-outline', 'red');
                        break;
                }

                return (
                    <Cell
                        image={image}
                        title={item.id}
                        onPress={() => {
                            navigation.push('AdminMediaScreen', { media: item });
                        }}
                    />
                );
            }}
        />
    );
}
