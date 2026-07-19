import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessagesService } from "./messages.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../auth/types/jwt-payload.type";
import { SendMessageDto } from "./dto/send-message.dto";

interface AuthSocket extends Socket {
    data: { user: JwtPayload }
}

@WebSocketGateway({
    cors: {
        origin: '*'
    },
    namespace: 'chat'
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly messagesService: MessagesService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const raw = client.handshake.auth?.token || client.handshake.headers['authorization']

            if (!raw) {
                client.disconnect()
                return
            }

            const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw // if token came via Header

            const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: this.config.get('JWT_ACCESS_SECRET')
            })

            client.data.user = payload

            client.join(`user:${payload.sub}`)

            console.log(`Client connected ${client.id} (user ${payload.sub})`)

        } catch (error) {
            console.error("Connection error:", error);
            client.disconnect();
        }
    }

    handleDisconnect(client: AuthSocket) {
        console.log(`Client disconnected: ${client.id}`);
    }


    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @ConnectedSocket() client: AuthSocket,
        @MessageBody() dto: SendMessageDto
    ) {
        const userId = client.data.user.sub

        const message = await this.messagesService.sendMessage(userId, dto)

        const conversation = await this.messagesService.getConversationParticipants(
            dto.conversationId
        )

        for (const p of conversation) {
            this.server.to(`user:${p.userId}`).emit('newMessage', message)
        }

        return message
    }

    @SubscribeMessage('markAsRead')
    async handleMarkAsRead(
        @ConnectedSocket() client: AuthSocket,
        @MessageBody() dto: { conversationId: string }
    ) {
        const userId = client.data.user.sub

        await this.messagesService.markAsRead(userId, dto.conversationId)

        const participants = await this.messagesService.getConversationParticipants(
            dto.conversationId
        )

        for (const p of participants) {
            this.server.to(`user:${p.userId}`).emit('messageRead', {
                conversationId: dto.conversationId,
                readerId: userId
            })
        }

        return { success: true }
    }

    @SubscribeMessage('typing')
    async handleTyping(
        @ConnectedSocket() client: AuthSocket,
        @MessageBody() dto: { conversationId: string; isTyping: boolean },
    ) {
        const userId = client.data.user.sub;

        const participants = await this.messagesService.getConversationParticipants(
            dto.conversationId,
        );

        // шлём всем УЧАСТНИКАМ, КРОМЕ самого печатающего
        for (const p of participants) {
            if (p.userId === userId) continue;
            this.server.to(`user:${p.userId}`).emit('userTyping', {
                conversationId: dto.conversationId,
                userId,
                isTyping: dto.isTyping,
            });
        }
    }
}