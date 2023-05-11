import { ChatRepository } from "@customTypes/domain"
import { PrismaClient } from "@prisma/client"

class ChatPrismaRepository implements ChatRepository {
    private prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    async sendMessage(userId: string, contactId: string, message: string) {
        const chat = await this.getChatId(userId, contactId)
        const chatId = chat?.chat_id as number

        return this.prisma.message.create({
            data: {
                chat_id: chatId,
                text: message,
                author_id: userId,
            },
        })
    }

    create(userId: string, contactId: string) {
        return this.prisma.chat.create({
            data: {
                ChatUsers: {
                    createMany: {
                        data: [{ user_id: userId }, { user_id: contactId }],
                    },
                },
            },
        })
    }

    async delete() {
        await this.prisma.chat.deleteMany({
            where: { NOT: { ChatUsers: { some: {} } } },
        })
    }

    getMessages(chatId: number) {
        return this.prisma.message.findMany({
            where: { chat_id: chatId },
        })
    }

    getLastMessage(chatId: number) {
        return this.prisma.message.findFirst({
            where: { chat_id: chatId },
            orderBy: { date: "desc" },
            select: { text: true, date: true, author_id: true },
        })
    }

    getAllWithContact(userId: string) {
        return this.prisma.chat.findMany({
            where: {
                ChatUsers: {
                    some: {
                        user_id: userId,
                    },
                },
                messages: {
                    some: {},
                },
            },
            include: {
                ChatUsers: {
                    where: {
                        NOT: {
                            user_id: userId,
                        },
                    },
                    select: {
                        user: true,
                    },
                },
            },
        })
    }

    async getContactName(contactId: string) {
        const contact = await this.prisma.contact.findFirst({
            where: { contact_id: contactId },
            select: { name: true },
        })
        return contact?.name as string
    }

    getChatId(userId: string, contactId: string) {
        return this.prisma.chatUsers.findFirst({
            where: {
                user_id: userId,
                chat: {
                    ChatUsers: { some: { user_id: contactId } },
                },
            },
            select: { chat_id: true },
        })
    }
}

export default ChatPrismaRepository
