import { Slider } from '@miblanchard/react-native-slider';
import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { EventManager } from '../models';
import { useAsyncEffects } from '../util';
type TagWithValue = Tag & { value: string };

function MapFilter(props) {
    const showPlannedEvents = props.showPlannedEvents;
    const setShowPlannedEvents = props.setShowPlannedEvents;
    const showCurrentEvents = props.showCurrentEvents;
    const setShowCurrentEvents = props.setShowCurrentEvents;
    const currentDayRange = props.currentDayRange;
    const setCurrentDayRange = props.setCurrentDayRange;
    const showFutureEvents = props.showFutureEvents;
    const setShowFutureEvents = props.setShowFutureEvents;
    const futureDayRange = props.futureDayRange;
    const setFutureDayRange = props.setFutureDayRange;

    // Dropdown State
    const [open, setOpen] = useState(false);
    // const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const selectedTags = props.selectedTags;
    const setSelectedTags = props.setSelectedTags;
    const dropdownHeight = 200;

    const [tags, setTags] = useState<TagWithValue[]>([]);
    useAsyncEffects(
        async () => {
            const response = await EventManager.fetchAllTags();
            const mappedTags = response.map((tag: Tag) => ({
                ...tag,
                value: tag.id,
            }));
            setTags(mappedTags);
        },
        [],
        { prefix: 'Failed to fetch tags' }
    );

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Range for visible events:</Text>
                    <View style={styles.sectionBody}>
                        <View style={{ flex: 3 }}>
                            <Text>
                                {currentDayRange == 0 ? 'Today' : `${currentDayRange} Days`}
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
                        <DropDownPicker
                            style={styles.dropdown}
                            multiple={true}
                            min={0}
                            max={3}
                            open={open}
                            onClose={() => {
                                setOpen(false);
                            }}
                            value={selectedTags}
                            items={tags}
                            setOpen={setOpen}
                            setValue={setSelectedTags}
                            setItems={setTags}
                            placeholder="Select tags"
                            maxHeight={dropdownHeight}
                            categorySelectable={false}
                            mode="BADGE"
                            badgeDotColors={[
                                '#e76f51',
                                '#00b4d8',
                                '#e9c46a',
                                '#e76f51',
                                '#8ac926',
                                '#00b4d8',
                                '#e9c46a',
                            ]}
                        />
                    </View>
                </View>
                {/* TODO: make this space somehow  */}
                {open ? <View style={{ height: dropdownHeight - 5 }}></View> : <></>}
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
