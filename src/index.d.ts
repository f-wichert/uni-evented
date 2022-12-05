type ToastType = import('react-native-toast-notifications').ToastType;
// eslint-disable-next-line no-var
declare var toast: ToastType;

declare module '*.jpg' {
    const path: number;
    export default path;
}
declare module '*.png' {
    const path: number;
    export default path;
}

// https://stackoverflow.com/questions/59617587/how-to-globally-redefine-the-formdata-typescript-interface-in-react-native
interface FormDataValue {
    uri: string;
    name: string;
    type: string;
}

interface FormData {
    append(name: string, value: FormDataValue, fileName?: string): void;
    set(name: string, value: FormDataValue, fileName?: string): void;
}
