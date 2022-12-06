import React, { useContext, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Context as AuthContext } from '../contexts/authContext';
// import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';

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

function CreateEventScreen() {
    const [name, setName] = useState('');

    // DatePickerState
    const [start, setStart] = useState(new Date());

    // Dropdown State
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([] as TagValue[]);
    const [items, setItems] = useState([...tags]);

    // Location State
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Location icon
    const [iconName, setIconName] = useState('location-outline');

    const { createEvent } = useContext(AuthContext);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setStart(currentDate);
    };

    const showModeStartPicker = (currentMode) => {
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
        const month = date.getMonth().toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} - ${hours}:${minutes}`;
    };

    async function grabLocation() {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })()
            .then(() => {
                setIconName('location');
            })
            .catch(() => {
                setIconName('error');
            });
    }

    return (
        <View style={[styles.container]}>
            <View style={[styles.row]}>
                <TextInput
                    style={[styles.textInput]}
                    placeholder="Event Name"
                    onChangeText={setName}
                />
                <Ionicons onPress={grabLocation} name={iconName} size={32} color={'orange'} />
            </View>
            <View style={[styles.row]}>
                <Text style={[styles.text]}>Start: {formatDate(start)}</Text>
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
            <Button color="orange" title="Create event!" onPress={() => createEvent()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        width: width,
        alignItems: 'center',
    },
    textInput: {
        borderBottomColor: 'black',
        borderBottomWidth: 0.25,
        fontSize: 25,
        margin: 10,
        paddingBottom: 5,
        width: 0.75 * width,
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
