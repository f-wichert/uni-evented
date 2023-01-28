import { Slider } from '@miblanchard/react-native-slider';
import Checkbox from 'expo-checkbox';
import React from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';

function MapFilter(props) {
    // const [showCurrentEvents, setShowCurrentEvents] = useState(true);
    // const [currentDayRange, setCurrentDayRange] = useState(1);
    // const [showFutureEvents, setShowFutureEvents] = useState(true);
    // const [futureDayRangeStart, setFutureDayRangeStart] = useState(2);
    // const [futureDayRangeEnd, setFutureDayRangeEnd] = useState(4);

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
                                step={true}
                                value={currentDayRange}
                                onValueChange={(e) => {
                                    setCurrentDayRange(e[0]);
                                }}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text>Bool Filters</Text>
                    <View style={styles.sectionBody}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Planned Events</Text>
                            <Checkbox
                                value={showPlannedEvents}
                                onValueChange={setShowPlannedEvents}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Show Planned Events</Text>
                            <Checkbox
                                value={showPlannedEvents}
                                onValueChange={setShowPlannedEvents}
                            />
                        </View>
                    </View>
                </View>
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

AppRegistry.registerComponent('SliderExample', () => SliderExample);

export default MapFilter;
