import { BaseEvent } from "@lebogo/eventsystem";

export class ReconnectEvent extends BaseEvent {
    constructor(public privateId?: string) {
        super("ReconnectEvent");
    }
}
