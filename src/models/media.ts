import config from '../config';
import { JSONObject } from '../types';

export const MediaTypes = ['image', 'video'] as const;
export type MediaType = typeof MediaTypes[number];

export interface MediaResponse extends JSONObject {
    readonly id: string;
    readonly mediaType: MediaType;
    readonly fileAvailable: boolean;
}

export interface Media {
    readonly id: string;
    readonly type: MediaType;
    readonly fileAvailable: boolean;
}

export class MediaManager {
    static src(media: Media, quality?: 'high' | 'medium' | 'low'): string {
        const file = media.type == 'image' ? quality || 'high.jpg' : 'index.m3u8';
        const path = `${config.BASE_URL}/media/${media.type}/${media.id}/${file}`;
        return path;
    }

    static fromMediaResponse(response: MediaResponse): Media {
        return { ...response, type: response.mediaType };
    }
}
