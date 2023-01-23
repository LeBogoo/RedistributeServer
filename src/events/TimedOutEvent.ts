import { BaseEvent } from "@lebogo/eventsystem";

export class TimedOutEvent extends BaseEvent {
    constructor() {
        super("TimedOutEvent");
    }
}
