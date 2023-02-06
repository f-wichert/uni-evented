import Slider from '@react-native-community/slider';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RecommendationSettings } from '../models/user';

import { useState } from 'react';
import { ProfileStackNavProps } from '../nav/types';
import { useUserStore } from '../state/user';
import { EmptyObject } from '../types';
import { asyncHandler, request } from '../util';

function ManageDiscoverFeed({ route, navigation }: ProfileStackNavProps<'ManageDiscoverFeed'>) {
    const [currentSettings, setCurrentSettings] = useState<RecommendationSettings>(
        route.params.currentRecommendationSettings
    );

    const onSubmit = asyncHandler(async () => {
        await request<EmptyObject>('POST', `/user/setRecommendationSettings`, {
            ...currentSettings,
        });
        await useUserStore.getState().fetchCurrentUser();
        navigation.goBack();
    });

    return (
        <View>
            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}>How important is distance to you?</Text>
                <Text style={styles.valueShow}>
                    {Math.round(currentSettings.DistanceWeight * 100)}
                </Text>
                <Slider
                    value={currentSettings.DistanceWeight}
                    onValueChange={(newValue) =>
                        setCurrentSettings((old) => ({ ...old, DistanceWeight: newValue }))
                    }
                />
            </View>

            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}>How important are matching tags?</Text>
                <Text style={styles.valueShow}>
                    {Math.round(currentSettings.TagIntersectionWeight * 100)}
                </Text>
                <Slider
                    value={currentSettings.TagIntersectionWeight}
                    onValueChange={(newValue) =>
                        setCurrentSettings((old) => ({ ...old, TagIntersectionWeight: newValue }))
                    }
                />
            </View>

            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}>How important are friends?</Text>
                <Text style={styles.valueShow}>
                    {Math.round(currentSettings.FolloweeIntersectionWeight * 100)}
                </Text>
                <Slider
                    value={currentSettings.FolloweeIntersectionWeight}
                    onValueChange={(newValue) =>
                        setCurrentSettings((old) => ({
                            ...old,
                            FolloweeIntersectionWeight: newValue,
                        }))
                    }
                />
            </View>

            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}>How important are event ratings?</Text>
                <Text style={styles.valueShow}>
                    {Math.round(currentSettings.AverageEventRatingWeight * 100)}
                </Text>
                <Slider
                    value={currentSettings.AverageEventRatingWeight}
                    onValueChange={(newValue) =>
                        setCurrentSettings((old) => ({
                            ...old,
                            AverageEventRatingWeight: newValue,
                        }))
                    }
                />
            </View>

            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}>Would you like more media?</Text>
                <Text style={styles.valueShow}>
                    {Math.round(currentSettings.NumberOfMediasWeigth * 100)}
                </Text>
                <Slider
                    value={currentSettings.NumberOfMediasWeigth}
                    onValueChange={(newValue) =>
                        setCurrentSettings((old) => ({ ...old, NumberOfMediasWeigth: newValue }))
                    }
                />
            </View>
            <View>
                <Button title="Submit preferences" onPress={onSubmit} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    settingsWrapper: {
        backgroundColor: 'white',
        margin: 8,
        padding: 6,
        borderRadius: 5,
    },
    titleHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    valueShow: {
        fontSize: 20,
        color: 'deepskyblue',
        marginLeft: 8,
    },
});

export default ManageDiscoverFeed;
