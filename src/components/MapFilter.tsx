import { Slider } from '@miblanchard/react-native-slider';
import Checkbox from 'expo-checkbox';
import React, { SetStateAction, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TagDropdown from './TagDropdown';

interface Props {
    showPlannedEvents: boolean;
    setShowPlannedEvents: (value: boolean) => void;
    showCurrentEvents: boolean;
    setShowCurrentEvents: (value: boolean) => void;
    currentDayRange: number;
    setCurrentDayRange: (value: number) => void;
    selectedTags: string[];
    setSelectedTags: (value: SetStateAction<string[]>) => void;
}

function MapFilter({
    showPlannedEvents,
    setShowPlannedEvents,
    showCurrentEvents,
    setShowCurrentEvents,
    currentDayRange,
    setCurrentDayRange,
    selectedTags,
    setSelectedTags,
}: Props) {
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
                            <Text>
                                {currentDayRange === 0 ? 'Today' : `${currentDayRange} Days`}
                            </Text>
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
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Event Filter:</Text>
                    <View style={styles.sectionBody}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text>Show Active Events</Text>
                            <Checkbox
                                style={styles.checkbox}
                                value={showCurrentEvents}
                                onValueChange={setShowCurrentEvents}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text>Show Planned Events</Text>
                            <Checkbox
                                style={styles.checkbox}
                                value={showPlannedEvents}
                                onValueChange={setShowPlannedEvents}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ ...styles.section, paddingTop: 10 }}>
                    <Text style={styles.sectionHeader}>Tag Filter:</Text>
                    <View style={styles.sectionBody}>
                        <TagDropdown
                            style={styles.dropdown}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                            showBackground={true}
                            maxHeight={200}
                            listMode="SCROLLVIEW"
                            min={0}
                            max={3}
                        />
                    </View>
                </View>
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
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#807c75',
    },
    sectionBody: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        // height: 40
        marginTop: 6,
        marginBottom: 1,
    },
    checkbox: {
        marginLeft: 5,
    },
});

export default MapFilter;
