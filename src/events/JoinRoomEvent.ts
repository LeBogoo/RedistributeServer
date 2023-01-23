import { BaseEvent } from "@lebogo/eventsystem";

export class JoinRoomEvent extends BaseEvent {
    constructor(public room: string, public id?: string) {
        super("JoinRoomEvent");
    }
}
