import { BaseEvent } from "@lebogo/eventsystem";

export class ConnectedEvent extends BaseEvent {
    constructor(public publicId: string, public privateId: string) {
        super("ConnectedEvent");
    }
}
