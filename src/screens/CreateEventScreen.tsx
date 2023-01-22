import Ionicons from '@expo/vector-icons/Ionicons';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import MapView, { LatLng, Marker } from 'react-native-maps';

import { INPUT_BACKGR_COLOR } from '../constants';
import { EventManager } from '../models';
import { Tag } from '../models/event';
import { EventListStackNavProps } from '../nav/types';
import { asyncHandler, useAsyncEffects } from '../util';

const width = Dimensions.get('window').width;

function CreateEventScreen({ navigation, route }: EventListStackNavProps<'CreateEvent'>) {
    // This is passed back from the map picker (https://reactnavigation.org/docs/params#passing-params-to-a-previous-screen).
    // If `params.location` changed, we call `setLocation` with the new value.

    const [tags, setTags] = useState<Tag[]>([]);
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

    const locationParam = route.params?.location;
    useEffect(() => {
        if (locationParam) {
            setLocation(locationParam);
        }
    }, [locationParam]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [useEndtime, setUseEndtime] = useState<boolean>(false);

    // DatePickerState
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());

    // Dropdown State
    const [open, setOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);

    // Location State
    const [location, setLocation] = useState<LatLng | null>(null);

    const onChangeStart = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (!selectedDate) {
            return;
        }
        setStart(selectedDate);
    };

    const onChangeEnd = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (!selectedDate) {
            return;
        }
        setEnd(selectedDate);
    };

    const showModeStartPicker = (currentMode: 'date' | 'time') => {
        // TODO: not supported on ios, which technically isn't a requirement but would be nice
        DateTimePickerAndroid.open({
            value: start,
            onChange: onChangeStart,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showModeEndPicker = (currentMode: 'date' | 'time') => {
        // TODO: not supported on ios, which technically isn't a requirement but would be nice
        DateTimePickerAndroid.open({
            value: end,
            onChange: onChangeEnd,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepickerStartPicker = () => {
        showModeStartPicker('date');
    };

    const showTimepickerStartPicker = () => {
        showModeStartPicker('time');
    };

    const showDatepickerEndPicker = () => {
        showModeEndPicker('date');
    };

    const showTimepickerEndPicker = () => {
        showModeEndPicker('time');
    };

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // not using `useCallback` here, since this would re-render almost every time anyway
    const onCreateButton = asyncHandler(
        async () => {
            // TODO: require these to be non-empty in the UI
            console.log(`Location: ${location}`);
            console.log(`start: ${start}`);
            console.log(`name: ${name}`);
            console.log(`description: ${description}`);
            console.log(`selectedTags: ${selectedTags}`);
            if (!location || !name || !start || !description || selectedTags.length === 0) {
                toast.show('Please input data for all the input fields.', { type: 'danger' });
                return;
            }

            if (useEndtime && start >= end) {
                toast.show('Change your start time so it is before your end time.', {
                    type: 'danger',
                });
                return;
            }

            const eventData: {
                name: string;
                tags: Tag[];
                location: LatLng;
                startDate?: Date | null;
                endDate?: Date | null;
            } = {
                name: name,
                tags: selectedTags,
                location: location,
                startDate: start,
            };

            if (end && useEndtime) {
                eventData.endDate = end;
            }

            const eventId = await EventManager.create(eventData);

            // TODO: this should replace the current screen in the stack
            navigation.navigate('EventDetail', {
                eventId,
            });
        },
        { prefix: 'Failed to create event' }
    );

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Name</Text>

                <View style={styles.sectionBody}>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type out your event name..."
                            onChangeText={setName}
                            maxLength={64}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <Ionicons
                        // TODO: this always opens the map picker to the default location,
                        // even if the user already picked a location
                        onPress={() => navigation.navigate('MapPicker')}
                        name={location ? 'location' : 'location-outline'}
                        size={26}
                        color={'orange'}
                    />
                </View>

                <View style={styles.sectionBody}>
                    {location ? (
                        <MapView
                            style={styles.locationPreviewMap}
                            // TODO: do something on press, or disable touch event instead?
                            zoomEnabled={false}
                            scrollEnabled={false}
                            pitchEnabled={false}
                            rotateEnabled={false}
                            region={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.001,
                                longitudeDelta: 0.001,
                            }}
                        >
                            <Marker
                                key={1}
                                coordinate={{
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                }}
                                title="Your party location"
                            />
                        </MapView>
                    ) : null}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>

                <View style={styles.sectionBody}>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type out your event description..."
                            onChangeText={setDescription}
                            maxLength={1000}
                            multiline
                            editable
                            numberOfLines={4}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date & Time</Text>
                <Text style={styles.sectionSubtitle}>Start</Text>
                <View style={styles.sectionBody}>
                    <View style={styles.dateTimeWrapper}>
                        <TouchableOpacity
                            style={styles.timeInput}
                            onPress={showTimepickerStartPicker}
                        >
                            <Text>{formatTime(start)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={showDatepickerStartPicker}
                        >
                            <Text>{formatDate(start)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.endRow}>
                    <Text style={{ ...styles.sectionSubtitle, marginTop: 10 }}>
                        {useEndtime ? 'Open End?' : 'Use end time?'}
                    </Text>
                    <Checkbox
                        style={styles.checkbox}
                        value={useEndtime}
                        onValueChange={setUseEndtime}
                    />
                </View>

                {useEndtime ? (
                    <View style={styles.sectionBody}>
                        <View style={styles.dateTimeWrapper}>
                            <TouchableOpacity
                                style={styles.timeInput}
                                onPress={showTimepickerEndPicker}
                            >
                                <Text>{formatTime(end)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={showDatepickerEndPicker}
                            >
                                <Text>{formatDate(end)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tags (1-5)</Text>

                <View style={styles.sectionBody}>
                    <DropDownPicker
                        style={[styles.dropdown]}
                        multiple={true}
                        min={1}
                        max={5}
                        open={open}
                        value={selectedTags}
                        items={tags}
                        setOpen={setOpen}
                        setValue={setSelectedTags}
                        setItems={setTags}
                        placeholder="Select up to three tags"
                        maxHeight={300}
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

            <Button color="orange" title="Create event!" onPress={onCreateButton} />
        </View>
    );
}

const styles = StyleSheet.create({
    endRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    checkbox: {
        marginLeft: 10,
    },
    container: {
        // flex: 1,
        minHeight: '100%',
        width: width,
        padding: 0,
    },
    section: {
        width: width,
        // backgroundColor: 'orange',
        padding: 10,
        // margin: 20
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionSubtitle: {
        fontSize: 16,
    },
    sectionBody: {
        marginTop: 8,
        marginRight: 10,
    },
    textInputWrapper: {
        backgroundColor: INPUT_BACKGR_COLOR,
        borderRadius: 5,
    },
    textInput: {
        // borderBottomColor: 'black',
        // borderBottomWidth: 0.25,
        // fontSize: 25,
        // margin: 10,
        // paddingBottom: 5,
        // width: 0.75 * width,
        // backgroundColor: '#d6d6d6',
        // borderRadius: 5
        marginLeft: 5,
        minHeight: 10,
    },
    dateTimeWrapper: {
        flexDirection: 'row',
    },
    timeInput: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 30,
        borderRadius: 5,
        backgroundColor: INPUT_BACKGR_COLOR,
    },
    dateInput: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 30,
        marginLeft: 20,
        borderRadius: 5,
        backgroundColor: INPUT_BACKGR_COLOR,
    },
    dropdown: {
        marginTop: 10,
        marginBottom: 10,
        width: 0.9 * width,
    },
    text: {
        fontSize: 15,
        padding: 10,
        textAlign: 'center',
    },
    button: {
        borderRadius: 25,
        backgroundColor: 'black',
        width: width * 0.75,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
    },
    locationPreviewMap: {
        width: '100%',
        height: 90,
        borderRadius: 5,
    },
});

export default CreateEventScreen;
