import { BaseEvent } from "@lebogo/eventsystem";
import { Server } from "ws";
import { ClientConnection } from "./ClientConnection";
import { ConnectedEvent } from "./events/ConnectedEvent";
import { DisconnectedEvent } from "./events/DisconnectEvent";
import { JoinRoomEvent } from "./events/JoinRoomEvent";
import { ReconnectEvent } from "./events/ReconnectEvent";
import { TimedOutEvent } from "./events/TimedOutEvent";
import { Room } from "./Room";

const rooms: Map<string, Room> = new Map();
const clients: Map<string, ClientConnection> = new Map();
const wsServer = new Server({
    port: 8080,
});

wsServer.on("connection", (socket) => {
    const connection = new ClientConnection(socket);
    console.log("New connection", connection.publicId);

    clients.set(connection.privateId, connection);

    connection.registerEvent<ConnectedEvent>("ConnectedEvent", (event) => {
        const oldConnection = clients.get(event.privateId || "");

        if (oldConnection) {
            clients.delete(connection.privateId);
            oldConnection.setSocket(socket);
            if (oldConnection.timeoutId) clearTimeout(oldConnection.timeoutId);
        }

        connection.send(new ConnectedEvent(connection.publicId, connection.privateId));
    });

    connection.registerEvent<JoinRoomEvent>("JoinRoomEvent", (event) => {
        const { room: roomName } = event;

        let room = rooms.get(roomName) || new Room(roomName);
        room.join(connection);

        rooms.set(roomName, room);

        connection.registerEvent<TimedOutEvent>("TimedOutEvent", () => {
            room.leave(connection);

            if (room.connections.length == 0) {
                rooms.delete(roomName);
            }
        });
    });

    connection.registerEvent<TimedOutEvent>("TimedOutEvent", () => {
        clients.delete(connection.privateId);
    });

    connection.registerEvent<BaseEvent>("*", (event) => {
        console.log("Received event", event, "from", connection.publicId);
    });
});
