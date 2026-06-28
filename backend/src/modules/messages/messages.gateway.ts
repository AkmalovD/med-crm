import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {MessagesService} from "./messages.service";

@WebSocketGateway({
    cors: {
        origin: '*'
    },
    namespace: 'chat'
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor(private readonly messagesService: MessagesService) {}

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.auth.headers['authorization']
            if (!token) {
                client.disconnect()
                return
            }


        }



    }
}