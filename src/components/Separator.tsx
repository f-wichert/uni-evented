import { View, ViewStyle } from 'react-native';

interface Props {
    color?: ViewStyle['backgroundColor'];
    width?: ViewStyle['width'];
}

export default function Separator({ color, width }: Props) {
    return (
        <View
            style={{
                height: 1,
                backgroundColor: color ?? '#e3e3e3',
                width: width ?? '95%',
                alignSelf: 'center',
            }}
        />
    );
}
