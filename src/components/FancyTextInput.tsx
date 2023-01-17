import React, { ReactNode, useCallback, useRef, useState } from 'react';
import {
    Falsy,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewStyle,
} from 'react-native';

interface Props {
    // main text props
    value: string;
    onChangeText: (text: string) => void;
    originalValue?: string;

    // other elements
    title: string;

    // validation
    validationError?: string | Falsy;
    maxLength?: number;

    style?: StyleProp<ViewStyle>;
    textInputProps?: Omit<
        TextInput['props'],
        'ref' | 'value' | 'style' | 'onChangeText' | 'onFocus' | 'onBlur'
    >;
}

export default function FancyTextInput({
    value,
    onChangeText,
    originalValue,

    title,

    validationError,
    maxLength,

    style,
    textInputProps,
}: Props) {
    // focus text input when text field is tapped (including title etc.)
    const inputRef = useRef<TextInput>(null);
    const focusOnPress = useCallback(() => inputRef.current?.focus(), [inputRef]);

    // if text input is not focused, grey out text if unchanged from original value
    const [showValue, setShowValue] = useState(originalValue !== value);
    const onBlur = useCallback(() => setShowValue(originalValue !== value), [originalValue, value]);
    const onFocus = useCallback(() => setShowValue(true), []);

    // handle `maxLength`
    let lengthText: ReactNode | undefined = undefined;
    if (maxLength !== undefined) {
        // if max length is exceeded, show length in bold and show error (if not set already)
        const exceedsLength = value.length > maxLength;
        lengthText = (
            <Text>
                <Text style={exceedsLength && { fontWeight: 'bold' }}>{value.length}</Text>
                {' / '}
                {maxLength}
            </Text>
        );
    }

    // use invalid style props if input is not valid
    const validationStyle = validationError ? styles.invalid : null;

    return (
        <Pressable onPress={focusOnPress} style={[styles.container, style, validationStyle]}>
            {/* title line */}
            <View style={styles.titleContainer}>
                <Text style={[styles.title, validationStyle]}>{title}</Text>
                <Text style={[styles.textLength, validationStyle]}>{lengthText}</Text>
            </View>
            {/* main input field */}
            <TextInput
                {...textInputProps}
                style={[styles.input, showValue ? null : styles.inputUnchanged]}
                value={value}
                onChangeText={onChangeText}
                ref={inputRef}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            {/* optional validation error subtitle */}
            {validationError ? (
                <Text style={[styles.errorSubtitle, styles.invalid]}>{validationError}</Text>
            ) : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingTop: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'dimgrey',
        backgroundColor: 'white',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 12,
        color: 'dimgrey',
    },
    textLength: {
        fontSize: 12,
        color: 'grey',
    },
    errorSubtitle: {
        marginBottom: -4,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
        maxWidth: '75%',
        alignSelf: 'flex-end',
    },
    input: {
        fontSize: 18,
        marginTop: 4,
    },
    inputUnchanged: {
        color: 'lightgrey',
    },
    // styles for invalid inputs
    invalid: {
        color: 'red',
        borderColor: 'red',
    },
});
