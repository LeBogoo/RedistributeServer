import { BaseEvent, EventSystem } from "@lebogo/eventsystem";
import { WebSocket } from "ws";
import { DisconnectedEvent } from "./events/DisconnectEvent";
import { randomUUID } from "crypto";
import { ConnectedEvent } from "./events/ConnectedEvent";
import { Room } from "./Room";
import { TimedOutEvent } from "./events/TimedOutEvent";

export class ClientConnection extends EventSystem {
    listeners: Map<string, Function[]> = new Map();
    connected: boolean = true;
    publicId: string;
    privateId: string;
    timeoutId: NodeJS.Timeout | null = null;

    constructor(public socket: WebSocket) {
        super();

        this.publicId = randomUUID();
        this.privateId = randomUUID();

        this.setSocket(socket);
    }

    setSocket(socket: WebSocket) {
        socket.on("message", this.messageReceived.bind(this));
        socket.on("close", () => {
            this.connected = false;
            this.emit(new DisconnectedEvent(this.publicId));

            this.timeoutId = setTimeout(() => {
                this.emit(new TimedOutEvent());
            }, 60 * 1000);
        });
    }

    send(event: BaseEvent) {
        this.socket.send(event.stringify());
    }

    close() {
        this.socket.close();
    }

    private messageReceived(message: Buffer) {
        try {
            this.parse(message.toString());
        } catch (e) {
            console.log("Invalid JSON received.");
        }
    }
}
