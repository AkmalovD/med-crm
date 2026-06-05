import {ForbiddenException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {CreateConverstionDto} from "./dto/create-converstion.dto";
import {SendMessageDto} from "./dto/send-message.dto";

@Injectable()
export class MessagesService {
    constructor(private readonly prisma: PrismaService) {}

    async getOrCreateConversation (userId: string, dto: CreateConverstionDto) {
        const existing = await this.prisma.conversation.findFirst({
            where: {
                participants: {
                    every: {
                        userId: { in: [userId, dto.participantId] }
                    },
                },
                AND: {
                    participants: {
                        some: { userId },
                    },
                },
            },
            include: {
                participants: { include: { user: true } },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: true }
                }
            }
        })

        if (existing && existing.participants.length === 2) return existing

        return this.prisma.conversation.create({
            data: {
                participants: {
                    create: [{ userId }, {userId: dto.participantId}],
                },
            },
            include: {
                participants: { include: { user: true } },
                messages: true
            }
        })
    }

    async getMyConversations(userId: string) {
        return this.prisma.conversation.findMany({
            where: {
                participants: { some: { userId } },
            },
            include: {
                participants: { include: { user: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // последнее сообщение для превью
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async getMessages(userId: string, conversationId: string) {
        const participant = await this.prisma.conversationParticipants.findFirst({
            where: { conversationId, userId },
        })

        if (!participant) throw new ForbiddenException('Нет доступа к этому диалогу')

        return this.prisma.message.findMany({
            where: {conversationId},
            include: {sender: true},
            orderBy: {createdAt: 'asc'},
        })
    }

    async sendMessage(userId: string, dto: SendMessageDto) {
        const participant = await this.prisma.conversationParticipants.findFirst({
            where: { conversationId: dto.conversationId, userId },
        })

        if (!participant) throw new ForbiddenException('Нет доступа к этому диалогу')

        const message = await this.prisma.message.create({
            data: {
                content: dto.content,
                conversationId: dto.conversationId,
                senderId: userId,
                createdAt: new Date(),
            },
            include: { sender: true }
        })

        await this.prisma.conversation.update({
            where: { id: dto.conversationId },
            data: { updatedAt: new Date() }
        })

        return message
    }

    async markAsRead(userId: string, conversationId: string) {
        await this.prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                readAt: null,
            },
            data: { readAt: new Date() }
        })

        return { success: true }
    }
}