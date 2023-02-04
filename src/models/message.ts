import { EmptyObject } from '../types';
import { request } from '../util';
import { User, UserResponse } from './user';

export interface MessageResponse {
    readonly id: string;
    readonly message: string;
    readonly sendTime: string;
    readonly sender: UserResponse;
}

export interface Message {
    readonly id: string;
    readonly message: string;
    readonly sendTime: Date;
    readonly sender: User;
}

export class MessageManager {
    static fromMessageResponse(response: MessageResponse): Message {
        const { sendTime, ...fields } = response;
        return { ...fields, sendTime: new Date(sendTime) };
    }

    static async fetchMessages(eventId: string): Promise<Message[]> {
        const data = await request<MessageResponse[]>('POST', '/event/getMessages', {
            eventId: eventId,
        });
        return data.map((m) => this.fromMessageResponse(m));
    }

    static async sendMessage(eventId: string, text: string) {
        await request<EmptyObject>('POST', '/event/sendMessage', {
            eventId: eventId,
            messageContent: text,
        });
    }
}
