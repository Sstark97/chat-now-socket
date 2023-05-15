"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
/**
 * @class ChatPrismaRepository
 * @description Repositorio de chats
 * @property {PrismaClient} prisma - Cliente de Prisma
 */
class ChatPrismaRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    /**
     * @function sendMessage
     * @param userId {string}
     * @param contactId {string}
     * @param message {string}
     * @description Envía un mensaje
     * @returns {Promise<Message>}
     */
    sendMessage(userId, contactId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this.getChatId(userId, contactId);
            const chatId = chat === null || chat === void 0 ? void 0 : chat.chat_id;
            return this.prisma.message.create({
                data: {
                    chat_id: chatId,
                    text: message,
                    author_id: userId,
                },
            });
        });
    }
    /**
     * @function create
     * @param userId {string}
     * @param contactId {string}
     * @description Crea un chat
     * @returns {Promise<Chat | null>}
     */
    create(userId, contactId) {
        return this.prisma.chat.create({
            data: {
                ChatUsers: {
                    createMany: {
                        data: [{ user_id: userId }, { user_id: contactId }],
                    },
                },
            },
        });
    }
    /**
     * @function delete
     * @description Elimina los chats sin mensajes
     * @returns {Promise<void>}
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.chat.deleteMany({
                where: { NOT: { ChatUsers: { some: {} } } },
            });
        });
    }
    /**
     * @function getMessages
     * @param chatId {number}
     * @description Obtiene los mensajes de un chat
     * @returns {Promise<Message[]>}
     */
    getMessages(chatId) {
        return this.prisma.message.findMany({
            where: { chat_id: chatId },
        });
    }
    /**
     * @function getLastMessage
     * @param chatId {number}
     * @description Obtiene el último mensaje de un chat
     * @returns {Promise<Message | null>}
     */
    getLastMessage(chatId) {
        return this.prisma.message.findFirst({
            where: { chat_id: chatId },
            orderBy: { date: "desc" },
            select: { text: true, date: true, author_id: true },
        });
    }
    /**
     * @function getAllWithContact
     * @param userId {string}
     * @description Obtiene todos los chats con mensajes de un usuario
     * @returns {Promise<Chat[]>}
     */
    getAllWithContact(userId) {
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
        });
    }
    /**
     * @function getContactName
     * @param contactId {string}
     * @description Obtiene el nombre de un contacto
     * @returns {Promise<string>}
     */
    getContactName(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield this.prisma.contact.findFirst({
                where: { contact_id: contactId },
                select: { name: true },
            });
            return contact === null || contact === void 0 ? void 0 : contact.name;
        });
    }
    /**
     * @function getChatId
     * @param userId {string}
     * @param contactId {string}
     * @description Obtiene el id de un chat
     * @returns {Promise<{chat_id: number} | null>}
     */
    getChatId(userId, contactId) {
        return this.prisma.chatUsers.findFirst({
            where: {
                user_id: userId,
                chat: {
                    ChatUsers: { some: { user_id: contactId } },
                },
            },
            select: { chat_id: true },
        });
    }
}
exports.default = ChatPrismaRepository;
