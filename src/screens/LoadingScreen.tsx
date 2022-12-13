import { StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <Spinner textContent="Loading..." visible={true} cancelable={false} animation="fade" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
    },
});
