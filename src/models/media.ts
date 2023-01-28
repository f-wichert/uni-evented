import urlJoin from 'url-join';

import config from '../config';
import { request } from '../util';

export const MediaTypes = ['image', 'video', 'livestream'] as const;
export type MediaType = typeof MediaTypes[number];

// ref: formatMediaForResponse
export interface MediaResponse {
    readonly id: string;
    readonly type: MediaType;
    readonly fileAvailable: boolean;
    // only included in `/upload/livestream` responses
    readonly streamKey?: string | null;
}

export interface Media {
    readonly id: string;
    readonly type: MediaType;
    readonly fileAvailable: boolean;
    readonly streamKey?: string | null;
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

    static async uploadImage(data: FormData): Promise<Media> {
        return this.fromMediaResponse(await request<MediaResponse>('POST', '/upload/image', data));
    }

    static async uploadClip(data: FormData): Promise<Media> {
        return this.fromMediaResponse(await request<MediaResponse>('POST', '/upload/clip', data));
    }

    static async uploadLivestream(eventId: string): Promise<Media> {
        return this.fromMediaResponse(
            await request<MediaResponse>('POST', '/upload/livestream', { eventID: eventId })
        );
    }
}
