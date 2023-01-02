import { WritableDraft } from 'immer/dist/types/types-external';
import { useCallback, useEffect } from 'react';
import shallow from 'zustand/shallow';

import { Event } from '../models';
import { EventStatus, RelevantEvents } from '../models/event';
import { notEmpty, request, useAsync } from '../util';
import { createStore } from './utils/createStore';

interface State {
    events: Readonly<{ [id: string]: Event }>;
    // `undefined` means the value hasn't loaded yet, it's expected to be set by `fetchCurrentUser`
    currentEventId: string | null | undefined;
}

export const useEventStore = createStore<State>('event')((set) => ({
    events: {},
    currentEventId: undefined,
}));

/** Creates helper for adding events to state, merging new data with existing data. */
export function addEventHelper(state: WritableDraft<State>) {
    return (event: Event) => {
        state.events[event.id] = {
            // (shallow) merge old and new event data
            // TODO: this probably causes unnecessary renders if the
            //       data didn't actually change, maybe use tracked state thingy?
            ...state.events[event.id],
            ...event,
        };
    };
}

export function useEvent(id: string): Event | undefined {
    return useEventStore((state) => state.events[id]);
}

export function useEventFetch(id: string) {
    if (!id) throw new Error(`Invalid event ID: ${id}`);

    const fetchFunc = useCallback(async () => {
        const eventData = (await request('GET', `event/info/${id}`)) as unknown as Event;

        useEventStore.setState((state) => addEventHelper(state)(eventData));
    }, [id]);

    const { refresh, loading, value: _ignored, ...rest } = useAsync(fetchFunc, false);

    const event = useEvent(id);
    useEffect(() => {
        // if event isn't stored already, start fetching it
        if (!event) {
            refresh();
        }
    }, [event, refresh]);

    return { refresh, loading, event, ...rest };
}

export function useRelevantEvents() {
    const fetchFunc = useCallback(async () => {
        const data = (await request('GET', 'event/relevantEvents')) as unknown as RelevantEvents;

        // add event objects to store
        useEventStore.setState((state) => {
            [
                ...data.activeEvent,
                ...data.myEvents,
                ...data.followedEvents,
                ...data.followerEvents,
            ].forEach(addEventHelper(state));
        });

        // return just the IDs
        return {
            activeEvent: data.activeEvent.map((e) => e.id),
            myEvents: data.myEvents.map((e) => e.id),
            followedEvents: data.followedEvents.map((e) => e.id),
            followerEvents: data.followerEvents.map((e) => e.id),
        };
    }, []);

    return useAsync(fetchFunc);
}

// NOTE: make sure `options` doesn't change every render (i.e. memoize it or use `useState` instead),
//       otherwise this will re-render indefinitely
export function useFindEvents(options?: {
    statuses?: EventStatus[];
    loadUsers?: boolean;
    loadMedia?: boolean;
    lat?: number;
    lon?: number;
    maxResults?: number;
    maxRadius?: number;
}) {
    const fetchFunc = useCallback(async () => {
        const eventsData = (await request('GET', 'event/find', options))
            .events as unknown as Event[];

        // add event objects to store
        useEventStore.setState((state) => {
            eventsData.forEach(addEventHelper(state));
        });

        // return just the IDs
        return eventsData.map((e) => e.id);
    }, [options]);

    const { value: eventIDs, ...rest } = useAsync(fetchFunc);

    const events = useEventStore(
        (state) => eventIDs?.map((id) => state.events[id]).filter(notEmpty) ?? [],
        shallow
    );

    return { events, ...rest };
}
