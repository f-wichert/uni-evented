import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { baseHeaders, asyncHandler, request } from '../util';
import { getToken } from '../state/auth';

declare type Props = {
    discoverData: { src: string; id: string };
    navigation: NavigationProp<ParamListBase>;
};

function VideoDiscover({ discoverData, navigation }: Props) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [score, setScore] = React.useState(Math.floor(Math.random() * 25));

    const upvote = () => {
        setScore(score + 1);
        updateScore('+');
    };

    const downvote = () => {
        setScore(score - 1);
        updateScore('-');
    };

    const updateScore = (vote: '+' | '-') => {
        // TODO: update score and send it to server on vote
        return
        asyncHandler(async () => {await request('POST', 'event/vote', getToken(), { id: discoverData.id, vote: vote });});
    };

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: discoverData.src,
                    headers: {
                        ...baseHeaders,
                    },
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
            <View style={{...styles.votingArea, }}>
                <Ionicons style={styles.voteIcon} name="chevron-up" size={36} onPress={upvote}/>
                <View>
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#c2c2c2'
                    }}>
                        {score}
                    </Text>
                </View>
                <Ionicons style={styles.voteIcon} name="chevron-down" size={36} onPress={downvote}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 8,
        margin: 5,
    },
    video: {
        width: 300,
        height: 450,
        flex: 1
    },
    votingArea:{
        width: 50,
        height: '100%',
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    voteIcon: {
        color: '#7d7d7d'
    }
});

export default VideoDiscover;
