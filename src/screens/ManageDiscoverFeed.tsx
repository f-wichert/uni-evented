import { Text, View } from 'react-native';

import { CommonStackProps } from '../nav/types';

interface Props extends CommonStackProps<'EventDetail'> {
    currentRecommendationSettings: any;
}

function ManageDiscoverFeed({ route, navigation }: Props) {
    console.log('Params');
    console.log(route.params.currentRecommendationSettings);
    console.log('End of Params');
    return (
        <View>
            <Text> This will be the Discover Feed Management Screen</Text>
        </View>
    );
}

export default ManageDiscoverFeed;
