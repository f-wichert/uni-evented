import Slider from '@react-native-community/slider';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RecommendationSettings } from '../models/user';

import { useState } from 'react';
import { CommonStackProps } from '../nav/types';
import { EmptyObject } from '../types';
import { asyncHandler, request } from '../util';

interface Props extends CommonStackProps<'EventDetail'> {
    currentRecommendationSettings: any;
}

function ManageDiscoverFeed({ route, navigation }: Props) {
    const [currentSettings, setCurrentSettings] = useState<RecommendationSettings>(
        route.params.currentRecommendationSettings as RecommendationSettings
    );

    console.log('Current Settings');
    console.log(currentSettings);
    console.log('End of Current Settings');

    const onSubmit = asyncHandler(async () => {
        await request<EmptyObject>('POST', `/user/setRecommendationSettings`, {
            ...currentSettings,
        }).catch(() => toast.show('Could not submit preferences'));
    });

    return (
        <View>
            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}> How important is distance for you?</Text>
                <Text style={styles.valueShow}>
                    {' '}
                    {Math.floor(currentSettings.DistanceWeight * 100)}
                </Text>
                <Slider
                    value={currentSettings.DistanceWeight}
                    onValueChange={(newValue) =>
                        setCurrentSettings(
                            Object.assign({ ...currentSettings }, { DistanceWeight: newValue })
                        )
                    }
                />
            </View>

            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}> How important are the right tags?</Text>
                <Text style={styles.valueShow}>
                    {' '}
                    {Math.floor(currentSettings.TagIntersectionWeight * 100)}
                </Text>
                <Slider
                    value={currentSettings.TagIntersectionWeight}
                    onValueChange={(newValue) =>
                        setCurrentSettings(
                            Object.assign(
                                { ...currentSettings },
                                { TagIntersectionWeight: newValue }
                            )
                        )
                    }
                />
            </View>

            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}> How important are friends?</Text>
                <Text style={styles.valueShow}>
                    {' '}
                    {Math.floor(currentSettings.FolloweeIntersectionWeight * 100)}
                </Text>
                <Slider
                    value={currentSettings.FolloweeIntersectionWeight}
                    onValueChange={(newValue) =>
                        setCurrentSettings(
                            Object.assign(
                                { ...currentSettings },
                                { FolloweeIntersectionWeight: newValue }
                            )
                        )
                    }
                />
            </View>

            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}> How important are Ratings?</Text>
                <Text style={styles.valueShow}>
                    {' '}
                    {Math.floor(currentSettings.AverageEventRatingWeight * 100)}
                </Text>
                <Slider
                    value={currentSettings.AverageEventRatingWeight}
                    onValueChange={(newValue) =>
                        setCurrentSettings(
                            Object.assign(
                                { ...currentSettings },
                                { AverageEventRatingWeight: newValue }
                            )
                        )
                    }
                />
            </View>

            <View style={styles.settingsWrapper}>
                <Text style={styles.titleHeader}> Would you like more media?</Text>
                <Text style={styles.valueShow}>
                    {' '}
                    {Math.floor(currentSettings.NumberOfMediasWeigth * 100)}
                </Text>
                <Slider
                    value={currentSettings.NumberOfMediasWeigth}
                    onValueChange={(newValue) =>
                        setCurrentSettings(
                            Object.assign(
                                { ...currentSettings },
                                { NumberOfMediasWeigth: newValue }
                            )
                        )
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
    },
    valueShow: {
        fontSize: 20,
        color: 'deepskyblue',
    },
});

export default ManageDiscoverFeed;
