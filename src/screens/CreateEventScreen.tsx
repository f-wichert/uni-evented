import Ionicons from '@expo/vector-icons/Ionicons';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useContext, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';

import { AuthContext } from '../contexts/authContext';
import { EventContext } from '../contexts/eventContext';
import { IoniconsName } from '../types';
import { INPUT_BACKGR_COLOR, BACKGR_COLOR } from '../const'; 
import { asyncHandler } from '../util';

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
    const [location, setLocation] = useState<LocationObject | null>(null);

    // Location icon
    const [iconName, setIconName] = useState<IoniconsName>('location-outline');

    const { createEvent } = useContext(EventContext);
    const { state: authState } = useContext(AuthContext);

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

    const grabLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setIconName('bug');
            throw new Error('Location access not granted');
        }

        setLocation(await Location.getCurrentPositionAsync());
        setIconName('location');
    };

    const onCreateButton = async () => {
        // TODO: require these to be non-empty in the UI
        if (!location || !name) {
            throw new Error('Invalid name or location');
        }
        await createEvent({ name: name, location: location, startDate: start }, authState.token);
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
                <Text style={styles.sectionTitle}>Location</Text>
                
                <View style={styles.sectionBody}>
                    <Ionicons onPress={grabLocation} name={iconName} size={32} color={'orange'} />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.text}>Start: {formatDate(start)}</Text>
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
                />
            </View>

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
            <Button
                color="orange"
                title="Create event!"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // height
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
    sectionBody: {
        marginTop: 8,
        marginRight: 10
    },
    textInputWrapper: {
        backgroundColor: INPUT_BACKGR_COLOR,
        borderRadius: 5
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
        minHeight: 10
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
});

export default CreateEventScreen;
