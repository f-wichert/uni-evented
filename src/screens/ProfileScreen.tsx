import React from 'react';
import { StyleSheet, Dimensions, View, Text, Image, Button, ScrollView, SafeAreaView} from 'react-native';

function getUserData(params) {
    return {
        profilePicture: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=745&q=80'
    }
}

function ProfileScreen(props) {
    const userData = getUserData()
    
    return (
        // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View>
            <View style={styles.profileHeader}>
                <Image
                    style={styles.profilePicture}
                    source={{uri:userData.profilePicture}}
                />
                <Text style={{
                    paddingTop: 20,
                    fontSize: 30
                }}>
                    Myself
                </Text>
            </View>
            {/* <View style={styles.optionsBody}>
                <View style={styles.optionSection}>
                    <View style={styles.optionSectionBody}>
                        <Text style={styles.optionText}>Logout</Text>
                    </View>
                </View>
                <View style={{...styles.optionSection, borderBottomWidth: 1}}>
                    <View style={styles.optionSectionBody}>
                        <Text style={styles.optionText}>Logout</Text>
                    </View>
                </View>
            </View> */}
            <SafeAreaView style={styles.optionsBody}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.optionSection}>
                        <View style={styles.optionSectionBody}>
                            <Text style={styles.optionText}>Option 2</Text>
                        </View>
                    </View>
                    <View style={styles.optionSection}>
                        <View style={styles.optionSectionBody}>
                            <Text style={styles.optionText}>Option 3</Text>
                        </View>
                    </View>
                    <View style={styles.optionSection}>
                        <View style={styles.optionSectionBody}>
                            <Text style={styles.optionText}>Option 4</Text>
                        </View>
                    </View>
                    <View style={styles.optionSection}>
                        <View style={styles.optionSectionBody}>
                            <Text style={styles.optionText}>Other Option 1</Text>
                        </View>
                    </View>
                    <View style={styles.optionSection}>
                        <View style={styles.optionSectionBody}>
                            <Text style={styles.optionText}>Other Option 2</Text>
                        </View>
                    </View>
                    <View style={{...styles.optionSection, borderBottomWidth: 1}}>
                        <View style={styles.optionSectionBody}>
                            <Text style={styles.optionText}>Logout</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        width: Dimensions.get('window').width,
        height: 350,
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'green'
    },
    profilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100
    },
    optionsBody: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionSection: {
        width: '100%',
        height: 50,
        paddingLeft: 8,
        borderTopWidth: 1,
        borderColor: '#e3e3e3',
        justifyContent: 'center',
    },
    optionSectionBody: {
        marginVertical: 5,
        justifyContent: 'center',
    },
    optionText: {
        fontSize: 16,
    },
    scrollView: {
        width: '95%'
    },
    text: {
        fontSize: 42,
    },
});

export default ProfileScreen;
