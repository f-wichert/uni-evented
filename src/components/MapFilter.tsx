import { Slider } from '@miblanchard/react-native-slider';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    showCurrentEvents: boolean;
    setShowCurrentEvents: (value: boolean) => void;
    currentDayRange: number;
    setCurrentDayRange: (value: number) => void;
    showFutureEvents: boolean;
    setShowFutureEvents: (value: boolean) => void;
    futureDayRange: number;
    setFutureDayRange: (value: number) => void;
}

function MapFilter({ currentDayRange, setCurrentDayRange }: Props) {
    const onCurrentDayRangeChange = useCallback(
        (value: number | number[]) => {
            // https://github.com/miblanchard/react-native-slider/issues/341
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (Array.isArray(value)) value = value[0]!;

            setCurrentDayRange(value);
        },
        [setCurrentDayRange]
    );

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Range for visible events:</Text>
                    <View style={styles.sectionBody}>
                        <View style={{ flex: 3 }}>
                            <Text>{currentDayRange} Days</Text>
                        </View>
                        <View style={{ flex: 14 }}>
                            <Slider
                                minimumValue={0}
                                maximumValue={7}
                                step={1}
                                value={currentDayRange}
                                onValueChange={onCurrentDayRangeChange}
                            />
                        </View>
                    </View>
                </View>
                {/* <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Range for future events:</Text>
                    <View style={styles.sectionBody}>
                        <View style={{ flex: 3 }}>
                            <Text>
                                {currentDayRange} - {futureDayRange} Days
                            </Text>
                        </View>
                        <View style={{ flex: 14 }}>
                            <Slider
                                minimumValue={0}
                                maximumValue={7}
                                step={1}
                                value={futureDayRange}
                                // maximumTrackTintColor="#d3d3d3"
                                // minimumTrackTintColor="#1fb28a"
                                // thumbTintColor="#1a9274"
                                onValueChange={(e) => {
                                    setFutureDayRange(e);
                                }}
                            />
                        </View>
                    </View>
                </View> */}
                {/* <View style={styles.section}>
                    <Pressable
                        onPress={(e) => {
                            console.log("Update");
                            refresh();
                        }}
                    >
                        <Text>Update</Text>
                    </Pressable>
                </View> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        // height: 70,
        position: 'absolute',
        top: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        elevation: 5,
        shadowColor: '#71717',
    },
    body: {
        margin: 7,
    },
    section: {},
    sectionHeader: {},
    sectionBody: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MapFilter;
