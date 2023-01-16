import { StyleProp, View, ViewStyle } from 'react-native';

interface Props {
    style?: StyleProp<ViewStyle>;
}

export default function Separator({ style }: Props) {
    return (
        <View
            style={[
                {
                    height: 1,
                    backgroundColor: '#b0b0b0',
                    width: '90%',
                    alignSelf: 'center',
                },
                style,
            ]}
        />
    );
}
