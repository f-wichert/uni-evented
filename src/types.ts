import { Icon } from '@expo/vector-icons/build/createIconSet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconName<T extends Icon<any, any>> = keyof T['glyphMap'];
export type IoniconsName = IconName<typeof Ionicons>;

export type JSONValue = string | number | boolean | JSONObject | JSONValue[] | null;

export type Props = {
    any:any;
    navigation: NavigationProp<ParamListBase>;
};

export interface JSONObject {
    [x: string]: JSONValue;
}

/**
 * An interface for media objects as returned from the backend
 */
export interface Media extends JSONObject {
    id: string;
    type: 'video' | 'image';
    fileAvailable: boolean;
    eventId: string;
    userId: string;
}

/**
 * An interface for media objects with client side additions
 */
export interface ExtendedMedia extends Media {
    src: string;
}
