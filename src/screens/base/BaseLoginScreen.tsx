import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import yellowSplash from '../../../assets/yellow_splash.png';
import Button from '../../components/Button';
import { IoniconsName } from '../../types';

interface Props {
    fields: {
        icon?: IoniconsName;
        onChange: (text: string) => void;
        textInputProps?: TextInput['props'];
    }[];
    submitButton: { text: string; callback: () => void };
    header: { title: string; subTitle: string };
    footer: { text: string; buttonText: string; callback: () => void }[];
}

export default function BaseLoginScreen({ fields, submitButton, header, footer }: Props) {
    return (
        <View style={styles.container}>
            <Image style={styles.art} source={yellowSplash} />

            <View style={styles.textBlock}>
                <View style={styles.headerText}>
                    <Text
                        style={{
                            fontSize: 44,
                            fontWeight: 'bold',
                        }}
                    >
                        {header.title}
                    </Text>
                    <Text style={styles.subtitleText}>{header.subTitle}</Text>
                </View>
            </View>

            <View style={styles.dataBlock}>
                {fields.map(({ icon, onChange, textInputProps }, index) => {
                    return (
                        // n.b. using `index` as the key here should be fine,
                        // as long as the list of input fields isn't rearranged
                        <View key={index} style={{ ...styles.inputBox, ...styles.elevation }}>
                            <Ionicons
                                name={icon}
                                size={20}
                                color={'black'}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={onChange}
                                {...textInputProps}
                            />
                        </View>
                    );
                })}

                <View style={styles.submitButtonContainer}>
                    <Button text={submitButton.text} onPress={submitButton.callback} />
                </View>
            </View>

            <View style={styles.infoBlock}>
                {footer.map((foot, index) => {
                    return (
                        <View style={styles.footerText} key={index}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#bdbdbd',
                                }}
                            >
                                {foot.text}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#D9B611',
                                    marginHorizontal: 8,
                                }}
                                onPress={foot.callback}
                            >
                                {foot.buttonText}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 40,
    },
    art: {
        height: 260,
        width: 400,
        position: 'absolute',
        transform: [{ translateX: 80 }, { rotate: '-120deg' }],
    },
    textBlock: {
        flex: 25,
        flexDirection: 'column-reverse',
        marginBottom: 50,
    },
    dataBlock: {
        flex: 30,
    },
    infoBlock: {
        flex: 10,
        flexDirection: 'column-reverse',
    },
    headerText: {
        height: 80,
        justifyContent: 'center',
    },
    footerText: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    elevation: {
        elevation: 15,
        shadowColor: '#71717',
    },
    inputBox: {
        height: 40,
        width: 300,
        flexDirection: 'row',
        paddingLeft: 5,
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#efefef',
    },
    inputIcon: {
        marginRight: 4,
    },
    input: {
        height: '100%',
        width: '100%',
    },
    subtitleText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#bdbdbd',
        // TODO: rework layout/styles to use view containers properly
        width: 300,
    },
    submitButtonContainer: {
        alignItems: 'flex-start',
    },
});
