import { Icon } from '@expo/vector-icons/build/createIconSet';
import Ionicons from '@expo/vector-icons/Ionicons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconName<T extends Icon<any, any>> = keyof T['glyphMap'];
export type IoniconsName = IconName<typeof Ionicons>;
<<<<<<< HEAD
export type VideoIdentifyer = {id:string,src:string};
export type JSONValue = string | number | boolean | JSONObject | JSONValue[];
export type BackendMediaRequest = {id:string}
=======

export type JSONValue = string | number | boolean | JSONObject | JSONValue[] | null;

>>>>>>> main
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
