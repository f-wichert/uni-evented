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
