import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { max } from 'react-native-reanimated';
import VideoCamera from '../components/VideoCamera';
import {Props} from '../types'
import { Tag } from '../components/Tag';
import { useAuthStore } from '../state/auth';
import { Rating, AirbnbRating } from 'react-native-ratings';

import { asyncHandler } from '../util';

function EventDetailScreen() {
    const [cameraActive, setCameraActive] = useState(false);

    const eventID = useAuthStore((state) => state.user?.currentEventId) // Get event ID of current event of currently logged in user
    console.log(eventID)

    function getProfilePicture() {
        return {
            profilePicture:
                'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=745&q=80',
        };
    }

    // Developement Values TODO: replace with request to real ones
    let event = {
        title:'Herrengarten Rave',
        tags: [{name:'Beer', color:'orange'}, {name:'Rave', color:'green'}, {name:'Techno',color:'red'}],
        numberOfAttendants: 5,
        startingTime: '19:00',
        endingTime: '23:30',
        address: 'Herrengarten and der Uni',
        musicStyle: 'Techno',
        rating: 4,
        description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'
    }
    
    return (
        <View style={[styles.container]}>
            <View style={styles.camera}>
                <Ionicons
                    name="camera"
                    size={64}
                    color="orange"
                    onPress={() => setCameraActive(true)}
                />
                <Text>Load Picture/Video of event here</Text>
            </View>
            <View style={styles.TagArea}>
                {
                    event.tags.map((tag) => <Tag style={{backgroundColor:tag.color}} key={tag.name}>{tag.name}</Tag>)
                }
            </View>
            <View style={styles.RatingArea}>
                <Rating/>
            </View>
            <View style={styles.InformationArea}>
                    <View style={styles.TitleLine}>
                        <Text style={{fontSize:25, fontWeight:'bold'}}>{event.title}</Text>
                        <View style={{display:'flex',flexDirection:'row', alignItems:'center'}}>
                            <Ionicons name='people' size={28}/>
                            <Text style={{fontSize:25, fontWeight:'bold', marginLeft:2}}>{event.numberOfAttendants}</Text>
                        </View>
                        <Image style={styles.ProfilePicture} source={{ uri: getProfilePicture().profilePicture }}/>
                    </View>
                <View style={styles.GeneralInformationArea}>
                    <View >
                        <Text style={{color:'grey', fontSize:16}}>{event.startingTime}-{event.endingTime}</Text>
                        <Text style={{fontSize:18, fontWeight:'bold'}}>{event.address}</Text>
                    </View>
                    <View style={{display:'flex',flexDirection:'row', alignItems:'center', marginRight:10}}>
                        <Ionicons name='musical-notes-sharp' size={25}></Ionicons>
                        <Text style={{fontSize:23, fontWeight:'900'}}>{event.musicStyle}</Text>
                    </View>
                </View>
                <View style={styles.DescriptionArea}>
                    <Text>{event.description}</Text>
                </View>
            </View>
            <View style={styles.ChatArea}>

            </View>
            <View style={styles.IMHereButtonContainer}>
                <Pressable style={styles.IMHereButtonArea} onPress={registerUserArrivalAtEvent}>
                    <Text style={styles.IMHereButton}> I'm Here!</Text>
                </Pressable>
            </View>
        </View>
    );
}

    function registerUserArrivalAtEvent() {
        console.log(`You are now checked in at the Event (Mock Message, did nothing)`)
    }

      const styles = StyleSheet.create({
        container: {
            
            alignItems: 'center',
        },
        column: {
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'flex-end',
            marginBottom: 10,
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
        },
        flexEl: {
            flex: 0.5,
            padding: 20,
        },
        camera: {
            display: 'flex',
            backgroundColor: 'grey',
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight:200,
            borderRadius: 10,
        },
        TagArea: {
            display: 'flex',
            flexDirection: 'row',
            alignSelf:'stretch',  // Float elements to the left
            flexWrap: 'wrap',
            backgroundColor: 'white',
            padding: 5,
        },
        RatingArea: {
            display: 'flex',
            flexDirection: 'row',
            alignSelf:'stretch',  // Float elements to the left
            flexWrap: 'wrap',
            backgroundColor: 'white',
            padding:5,
            paddingLeft: 7,
        },
        InformationArea: {
            display: 'flex',
            alignSelf:'stretch',  // Float elements to the left
            backgroundColor: 'white',
        },
        TitleLine:{
            display: 'flex',
            flexDirection: 'row',
            alignSelf:'stretch',  // Float elements to the left
            justifyContent: 'space-between',
            alignItems:'center',
        },
        ProfilePicture:{
            width:35,
            height:35,
            borderRadius:100,
            marginRight:7,
        },
        GeneralInformationArea: {
            display:'flex',
            flexDirection: 'row', 
            alignSelf:'stretch',
            justifyContent:'space-between'
        },
        DescriptionArea:{
            padding:10,
        },
        ChatArea:{
            
        },
        IMHereButtonContainer:{
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'stretch',
            justifyContent: 'center',
            padding:6,
            backgroundColor:'lightgrey',
        },
        IMHereButtonArea: {
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'stretch',
            flex:1,
            justifyContent: 'center',
            // marginHorizontal: 3,
            borderRadius:9,
            backgroundColor: 'black',
            padding: 7,
        },
        IMHereButton: {
            color:'white',
            fontWeight: 'bold',
            fontSize: 30,
        },
    });

export default EventDetailScreen;