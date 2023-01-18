type ViewProps = import('react-native').ViewProps;

declare module 'react-native-nodemediaclient' {
    interface NodeCameraViewProps extends ViewProps {
        outputUrl?: string;
        camera?: {
            cameraId?: 0 | 1;
            cameraFrontMirror?: boolean;
        };
        audio?: {
            bitrate?: number;
            profile?: 0 | 1 | 2;
            samplerate?: 8000 | 16000 | 32000 | 44100 | 48000;
        };
        video?: {
            preset?: number;
            bitrate?: number;
            profile?: 0 | 1 | 2;
            fps?: 15 | 20 | 24 | 30;
            videoFrontMirror?: boolean;
        };
        autopreview?: boolean;
        denoise?: boolean;
        dynamicRateEnable?: boolean;
        smoothSkinLevel?: 0 | 1 | 2 | 3 | 4 | 5;
        cryptoKey?: string;
        onStatus?(...args: unknown[]): unknown;
    }
    export class NodeCameraView extends React.Component<NodeCameraViewProps> {
        switchCamera(): void;
        flashEnable(enable: boolean): void;
        startPreview(): void;
        stopPreview(): void;
        start(): void;
        stop(): void;
    }

    interface NodePlayerViewProps extends ViewProps {
        inputUrl?: string;
        bufferTime?: number;
        maxBufferTime?: number;
        autoplay?: boolean;
        audioEnable?: boolean;
        scaleMode?: 'ScaleToFill' | 'ScaleAspectFit' | 'ScaleAspectFill';
        renderType?: 'SURFACEVIEW' | 'TEXTUREVIEW';
        cryptoKey?: string;
        onStatus?(...args: unknown[]): unknown;
    }
    export class NodePlayerView extends React.Component<NodePlayerViewProps> {
        pause(): void;
        start(): void;
        stop(): void;
    }
}
