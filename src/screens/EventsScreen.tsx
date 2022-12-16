import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TabPropsFor } from '../nav/TabNavigator';

type ComponentProps = TabPropsFor<'Events'>;

function EventsScreen({ navigation }: ComponentProps) {
    return (
        <View>
            <Text>Hi</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

export default EventsScreen;
