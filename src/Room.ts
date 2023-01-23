import { BaseEvent, EventSystem } from "@lebogo/eventsystem";
import { ClientConnection } from "./ClientConnection";
import { ConnectedEvent } from "./events/ConnectedEvent";
import { DisconnectedEvent } from "./events/DisconnectEvent";
import { JoinRoomEvent } from "./events/JoinRoomEvent";

export class Room extends EventSystem {
    public connections: ClientConnection[] = [];
    constructor(public name: string) {
        super();
    }

    join(connection: ClientConnection) {
        if (this.connections.includes(connection)) return;
        this.connections.push(connection);
        connection.registerEvent<BaseEvent>("*", (event) => {
            this.emit(event);
            this.broadcast(event);
        });

        this.broadcast(new JoinRoomEvent(this.name, connection.publicId));
    }

    leave(connection: ClientConnection) {
        this.connections = this.connections.filter((c) => c != connection);
    }

    broadcast(event: BaseEvent): void {
        this.connections.forEach((connection) => {
            connection.send(event);
        });
    }
}
