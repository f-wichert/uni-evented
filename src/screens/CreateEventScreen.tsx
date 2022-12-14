import Ionicons from '@expo/vector-icons/Ionicons';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
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

import MapView, { LatLng, Marker } from 'react-native-maps';
import { INPUT_BACKGR_COLOR } from '../const';
import { useAuthStore } from '../state/auth';
import { IoniconsName } from '../types';

const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

const tags = [
    { label: 'Activity', value: 'activity' },
    { label: 'Party', value: 'party', parent: 'activity' },
    { label: 'Boardgames', value: 'boardgames', parent: 'activity' },
    { label: 'Sports', value: 'sports', parent: 'activity' },
    { label: 'Drinking', value: 'drinking', parent: 'activity' },
    { label: 'Chilling', value: 'chilling', parent: 'activity' },
    { label: 'Music', value: 'music' },
    { label: 'Jazz', value: 'jazz', parent: 'music' },
    { label: 'Techno', value: 'techno', parent: 'music' },
    { label: 'Rock', value: 'rock', parent: 'music' },
    { label: 'R&B', value: 'rnb', parent: 'music' },
    { label: 'Reggae', value: 'reggae', parent: 'music' },
] as const;
type TagValue = typeof tags[number]['value'];

function CreateEventScreen(props) {
    const [name, setName] = useState('');

    // DatePickerState
    const [start, setStart] = useState(new Date());

    // Dropdown State
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([] as TagValue[]);
    const [items, setItems] = useState([...tags]);

    // Location State
    const [location, setLocation] = useState<LatLng | null>(null);

    // Location icon
    const [iconName, setIconName] = useState<IoniconsName>('location-outline');

    const createEvent = useAuthStore((state) => state.createEvent);

    const recieveLocation = (loc) => {
        // console.log(`location recieved: ${JSON.stringify(loc)}`);
        setLocation(loc);
        // console.log(`Assigend location: ${location}`);
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (!selectedDate) {
            return;
        }
        setStart(selectedDate);
    };

    const showModeStartPicker = (currentMode: 'date' | 'time') => {
        // TODO: not supported on ios, which technically isn't a requirement but would be nice
        DateTimePickerAndroid.open({
            value: start,
            onChange,
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

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} - ${hours}:${minutes}`;
    };

    const formatStartTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatStartDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const grabLocation = async () => {
        console.log('Location grabbed');

        props.navigation.navigate('MapPicker', {
            returnLocation: recieveLocation,
        });
    };

    const onCreateButton = async () => {
        // TODO: require these to be non-empty in the UI
        console.log(`name: ${name}`);
        console.log(`loc: ${JSON.stringify(location)}`);

        if (!location || !name) {
            throw new Error('Invalid name or location');
        }
        await createEvent({ name: name, location: location, startDate: start });
    };

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
                        />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <Ionicons onPress={grabLocation} name={iconName} size={26} color={'orange'} />
                </View>

                <View style={styles.sectionBody}>
                    {location ? (
                        <TouchableOpacity onPressIn={console.log('hi')}>
                            <MapView
                                style={styles.locationPreviewMap}
                                onPress={(e) => console.log('E')}
                                zoomEnabled={false}
                                scrollEnabled={false}
                                initialRegion={{
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
                        </TouchableOpacity>
                    ) : null}
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
                            <Text>{formatStartTime(start)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dateInput}>
                            <Text>{formatStartDate(start)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={{ ...styles.sectionSubtitle, marginTop: 10 }}>End...</Text>

                {/* <Text style={styles.text}>Start: {formatDate(start)}</Text>
                <Ionicons
                    onPress={showDatepickerStartPicker}
                    name={'calendar-outline'}
                    size={32}
                    color={'orange'}
                />
                <Ionicons
                    onPress={showTimepickerStartPicker}
                    name={'time-outline'}
                    size={32}
                    color={'orange'}
                /> */}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tags</Text>

                <View style={styles.sectionBody}>
                    <DropDownPicker
                        style={[styles.dropdown]}
                        multiple={true}
                        min={1}
                        max={3}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
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
