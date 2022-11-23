import { Icon } from '@expo/vector-icons/build/createIconSet';
import Ionicons from '@expo/vector-icons/Ionicons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconName<T extends Icon<any, any>> = keyof T['glyphMap'];
export type IoniconsName = IconName<typeof Ionicons>;

export type JSONValue = string | number | boolean | JSONObject | JSONValue[];

export interface JSONObject {
    [x: string]: JSONValue;
}
