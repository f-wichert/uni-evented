import React, { useState } from 'react';
import { Alert, Button, Dimensions, StyleSheet, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

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
  const [location, setLocation] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  // Dropdown State
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([] as TagValue[]);
  const [items, setItems] = useState([...tags]);

  function createEvent() {
    Alert.alert(
      `Event created!\nName: ${name}\nLocation: ${location}\nStart: ${start}\nEnd: ${end}\nTags: ${value}`
    );
  }

  return (
    <View style={[styles.container]}>
      <TextInput style={[styles.textInput]} placeholder="Event Name" onChangeText={setName} />
      <TextInput
        style={[styles.textInput]}
        placeholder="Select Location"
        onChangeText={setLocation}
      />
      <TextInput style={[styles.textInput]} placeholder="Select Start" onChangeText={setStart} />
      <TextInput
        style={[styles.textInput]}
        placeholder="Select End (optional)"
        onChangeText={setEnd}
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
    width: 0.9 * width,
  },
  dropdown: {
    marginTop: 10,
    marginBottom: 10,
    width: 0.9 * width,
  },
  text: {
    fontSize: 25,
    padding: 10,
  },
  button: {
    borderRadius: 25,
    backgroundColor: 'black',
    width: width * 0.75,
  },
});

export default CreateEventScreen;
