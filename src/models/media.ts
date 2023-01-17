import urlJoin from 'url-join';

import config from '../config';
import { JSONObject } from '../types';

export const MediaTypes = ['image', 'video', 'livestream'] as const;
export type MediaType = typeof MediaTypes[number];

export interface MediaResponse extends JSONObject {
    readonly id: string;
    readonly type: MediaType;
    readonly fileAvailable: boolean;
}

export interface Media {
    readonly id: string;
    readonly type: MediaType;
    readonly fileAvailable: boolean;
}

export class MediaManager {
    static src(media: Media, quality?: 'auto' | '1080' | '720' | '480' | '360'): string {
        const parsedVideoQuality = quality === 'auto' ? undefined : quality;
        let parsedImageQuality = 'high';
        switch (quality) {
            case 'auto':
                parsedImageQuality = 'high';
                break;
            case '1080':
                parsedImageQuality = 'high';
                break;
            case '720':
                parsedImageQuality = 'high';
                break;
            case '480':
                parsedImageQuality = 'medium';
                break;
            case '360':
                parsedImageQuality = 'low';
                break;
        }

        if (media.type === 'livestream') {
            console.log(`${config.NMS_RTMP_URL}/livestream/${media.id}`);
            return `${config.NMS_RTMP_URL}/livestream/${media.id}`;
        }

        const file =
            media.type === 'image'
                ? `${parsedImageQuality}.jpg`
                : `index${parsedVideoQuality ? `-${quality}p` : ''}.m3u8`;

        const path = urlJoin(config.BASE_URL, 'media', media.type, media.id, file);

        return path;
    }

    static fromMediaResponse(response: MediaResponse): Media {
        return { ...response };
    }
}
