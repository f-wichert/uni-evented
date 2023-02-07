import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs';
import Checkbox from 'expo-checkbox';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TagDropdown from '../components/TagDropdown';

import { GOOGLE_MAPS_STYLE, INPUT_BACKGR_COLOR } from '../constants';
import { EventManager } from '../models';
import { EventUpdateParams } from '../models/event';
import { CommonStackProps } from '../nav/types';
import { useEventFetch } from '../state/event';
import { asyncHandler } from '../util';

const width = Dimensions.get('window').width;

function EventDetailEditScreen({ route, navigation }: CommonStackProps<'EventDetailEdit'>) {
    const { event: eventData, loading, refresh } = useEventFetch(route.params.eventId);

    // This is passed back from the map picker (https://reactnavigation.org/docs/params#passing-params-to-a-previous-screen).
    // If `params.location` changed, we call `setLocation` with the new value.
    const locationParam = route.params?.location;
    useEffect(() => {
        if (locationParam) {
            setLocation(locationParam);
        }
    }, [locationParam]);

    const [name, setName] = useState(eventData!.name);
    const [description, setDescription] = useState(eventData!.description);

    const [useEndtime, setUseEndtime] = useState<boolean>(!!eventData!.endDate);

    // date/time picker state
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState<'time' | 'date'>('time');
    const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');
    eventData?.startDate;
    // default start to next minute, and default end to "start + 2h"
    const [start, setStart] = useState<Date>(eventData!.startDate);
    const [end, setEnd] = useState<Date>(
        eventData!.endDate ?? dayjs(eventData!.startDate).add(2, 'hours').toDate()
    );

    // (list of tag IDs)
    const [selectedTags, setSelectedTags] = useState<string[]>(
        eventData!.tags.map((tag) => tag.id)
    );

    // Location State
    const [location, setLocation] = useState<LatLng | null>({
        latitude: eventData!.lat,
        longitude: eventData!.lon,
    } as LatLng);

    // date/time picker callbacks
    const hidePicker = useCallback(() => setPickerVisible(false), []);
    const showPicker = useCallback((mode: 'time' | 'date', target: 'start' | 'end') => {
        setPickerMode(mode);
        setPickerTarget(target);
        setPickerVisible(true);
    }, []);

    const showStartTimePicker = useCallback(() => showPicker('time', 'start'), [showPicker]);
    const showStartDatePicker = useCallback(() => showPicker('date', 'start'), [showPicker]);
    const showEndTimePicker = useCallback(() => showPicker('time', 'end'), [showPicker]);
    const showEndDatePicker = useCallback(() => showPicker('date', 'end'), [showPicker]);

    const onPickerConfirm = useCallback(
        (date: Date) => {
            hidePicker();

            const setState = pickerTarget === 'start' ? setStart : setEnd;
            setState(date);
        },
        [pickerTarget, hidePicker]
    );

    const formatTime = (date: Date) => {
        const d = dayjs(date);
        return d.format('HH:mm');
    };

    const formatDate = (date: Date) => {
        const d = dayjs(date);
        return d.format('ddd, DD.MM.YYYY');
    };

    // not using `useCallback` here, since this would re-render almost every time anyway
    const onUpdateButton = asyncHandler(
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

            const eventData: EventUpdateParams = {
                name: name,
                tags: selectedTags,
                description: description,
                location: location,
                startDate: start,
                eventId: route.params.eventId,
            };

            if (useEndtime) eventData.endDate = end;

            const eventId = await EventManager.update(eventData);
            // TODO: this should replace the current screen in the stack
            if (eventId) {
                navigation.goBack();
            }
        },
        { prefix: 'Failed to create event' }
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Name</Text>

                <View style={styles.sectionBody}>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type out your event name..."
                            onChangeText={setName}
                            maxLength={64}
                            defaultValue={name}
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
                        onPress={() => {
                            navigation.push('MapPicker', {
                                location: location,
                                eventId: route.params.eventId,
                                parent: 'EventDetailEdit',
                            });
                        }}
                        name={location ? 'location' : 'location-outline'}
                        size={26}
                        color={'orange'}
                    />
                </View>

                <View style={styles.sectionBody}>
                    {location ? (
                        <MapView
                            customMapStyle={GOOGLE_MAPS_STYLE}
                            style={styles.locationPreviewMap}
                            // TODO: do something on press, or disable touch event instead?
                            zoomEnabled={false}
                            scrollEnabled={false}
                            pitchEnabled={false}
                            rotateEnabled={false}
                            region={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.002,
                                longitudeDelta: 0.002,
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
                            defaultValue={description}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date & Time</Text>
                <Text style={styles.sectionSubtitle}>Start</Text>
                <View style={styles.sectionBody}>
                    <View style={styles.dateTimeWrapper}>
                        <TouchableOpacity style={styles.timeInput} onPress={showStartTimePicker}>
                            <Text>{formatTime(start)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dateInput} onPress={showStartDatePicker}>
                            <Text>{formatDate(start)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.endRow}>
                    <Text style={{ ...styles.sectionSubtitle, marginTop: 10 }}>Set End Time?</Text>
                    <Checkbox
                        style={styles.checkbox}
                        value={useEndtime}
                        onValueChange={setUseEndtime}
                    />
                </View>

                {useEndtime ? (
                    <View style={styles.sectionBody}>
                        <View style={styles.dateTimeWrapper}>
                            <TouchableOpacity style={styles.timeInput} onPress={showEndTimePicker}>
                                <Text>{formatTime(end)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateInput} onPress={showEndDatePicker}>
                                <Text>{formatDate(end)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}

                <DateTimePickerModal
                    isVisible={isPickerVisible}
                    mode={pickerMode}
                    date={pickerTarget === 'start' ? start : end}
                    onConfirm={onPickerConfirm}
                    onCancel={hidePicker}
                    is24Hour={true}
                    // force theme on iOS because reasons
                    themeVariant="light"
                    // show calendar instead of spinner for date picker on iOS
                    display={pickerMode === 'date' && Platform.OS === 'ios' ? 'inline' : undefined}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tags (up to 5)</Text>

                <View style={styles.sectionBody}>
                    <TagDropdown
                        style={styles.dropdown}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        maxHeight={300}
                        listMode="SCROLLVIEW"
                        min={1}
                        max={5}
                    />
                </View>
            </View>

            <Button color="orange" title="Update event Info" onPress={onUpdateButton} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    endRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
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

export default EventDetailEditScreen;
