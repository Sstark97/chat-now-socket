import { ChatRepository } from "../../types/domain"
import { PrismaClient } from "@prisma/client"

/**
 * @class ChatPrismaRepository
 * @description Repositorio de chats
 * @property {PrismaClient} prisma - Cliente de Prisma
 */
class ChatPrismaRepository implements ChatRepository {
    private prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    /**
     * @function sendMessage
     * @param userId {string}
     * @param contactId {string}
     * @param message {string}
     * @description Envía un mensaje
     * @returns {Promise<Message>}
     */
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

    /**
     * @function create
     * @param userId {string}
     * @param contactId {string}
     * @description Crea un chat
     * @returns {Promise<Chat | null>}
     */
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

    /**
     * @function delete
     * @description Elimina los chats sin mensajes
     * @returns {Promise<void>}
     */
    async delete() {
        await this.prisma.chat.deleteMany({
            where: { NOT: { ChatUsers: { some: {} } } },
        })
    }

    /**
     * @function getMessages
     * @param chatId {number}
     * @description Obtiene los mensajes de un chat
     * @returns {Promise<Message[]>}
     */
    getMessages(chatId: number) {
        return this.prisma.message.findMany({
            where: { chat_id: chatId },
        })
    }

    /**
     * @function getLastMessage
     * @param chatId {number}
     * @description Obtiene el último mensaje de un chat
     * @returns {Promise<Message | null>}
     */
    getLastMessage(chatId: number) {
        return this.prisma.message.findFirst({
            where: { chat_id: chatId },
            orderBy: { date: "desc" },
            select: { text: true, date: true, author_id: true },
        })
    }

    /**
     * @function getAllWithContact
     * @param userId {string}
     * @description Obtiene todos los chats con mensajes de un usuario
     * @returns {Promise<Chat[]>}
     */
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

    /**
     * @function getContactName
     * @param contactId {string}
     * @description Obtiene el nombre de un contacto
     * @returns {Promise<string>}
     */
    async getContactName(contactId: string) {
        const contact = await this.prisma.contact.findFirst({
            where: { contact_id: contactId },
            select: { name: true },
        })
        return contact?.name as string
    }

    /**
     * @function getChatId
     * @param userId {string}
     * @param contactId {string}
     * @description Obtiene el id de un chat
     * @returns {Promise<{chat_id: number} | null>}
     */
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
