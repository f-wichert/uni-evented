import config from '../config';
import { JSONObject } from '../types';

export const MediaTypes = ['image', 'video'] as const;
export type MediaType = typeof MediaTypes[number];

export interface MediaResponse extends JSONObject {
    id: string;
    mediaType: MediaType;
    fileAvailable: boolean;
}

export default class Media {
    readonly id: string;
    readonly type: MediaType;
    readonly fileAvailable: boolean;

    constructor({
        id,
        type,
        fileAvailable,
    }: {
        id: string;
        type: MediaType;
        fileAvailable: boolean;
    }) {
        this.id = id;
        this.type = type;
        this.fileAvailable = fileAvailable;
    }

    src(quality?: 'high' | 'medium' | 'low'): string {
        const file = this.type == 'image' ? quality || 'high.jpg' : 'index.m3u8';
        const path = `${config.BASE_URL}/media/${this.type}/${this.id}/${file}`;
        return path;
    }

    static fromMediaResponse(response: MediaResponse) {
        return new Media({ ...response, type: response.mediaType });
    }
}
