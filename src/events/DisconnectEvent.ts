import { BaseEvent } from "@lebogo/eventsystem";

export class DisconnectedEvent extends BaseEvent {
    constructor(public id: string) {
        super("DisconnectedEvent");
    }
}
