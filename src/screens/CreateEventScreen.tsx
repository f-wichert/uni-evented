import React, { useState, } from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';


function CreateEventScreen() {

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    // Dropdown State
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
        {label: 'Activity', value:'activity',},
        {label: 'Party', value: 'party', parent: 'activity'},
        {label: 'Boardgames', value: 'boardgames', parent: 'activity'},
        {label: 'Sports', value: 'sports', parent: 'activity'},
        {label: 'Drinking', value: 'drinking', parent: 'activity'},
        {label: 'Chilling', value: 'chilling', parent: 'activity'},
        {label: 'Music', value:'music',},
        {label: 'Jazz', value: 'jazz', parent: 'music'},
        {label: 'Techno', value: 'techno', parent: 'music'},
        {label: 'Rock', value: 'rock', parent: 'music'},
        {label: 'R&B', value: 'rnb', parent: 'music'},
        {label: 'Reggae', value: 'reggae', parent: 'music'},
    ]);


    function createEvent() {
        Alert.alert(`Event created! \nTags: ${value}`);
    }

    
    return (
        <View style={[styles.container,]}>
            <TextInput 
                style={[styles.textInput,]}
                placeholder="Event Name"
                onChangeText={setName}
            />
            <TextInput 
                style={[styles.textInput,]}
                placeholder="Select location"
                onChangeText={setLocation}
            />
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
            /> 
            <Button
                color='orange'
                title="Create event!"
                onPress={() => createEvent()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    textInput: {
        borderBottomColor: 'black',
        borderBottomWidth: 0.25,
        fontSize: 25,
        margin: 10,
        paddingBottom: 5
    },
    dropdown: {
        marginTop: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 25,
        padding: 10,
    },
    button: {
        borderRadius: 25,
        backgroundColor: 'black',
    }
});

export default CreateEventScreen;