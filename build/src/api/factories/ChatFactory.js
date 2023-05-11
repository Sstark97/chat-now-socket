"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatFactory = void 0;
const ChatPrismaRepository_1 = __importDefault(require("../repositories/ChatPrismaRepository"));
const ChatService_1 = __importDefault(require("../services/ChatService"));
/**
 * @class ChatFactory
 * @description Factoría para crear instancias de ChatService
 */
class ChatFactory {
    /**
     * @static
     * @method createChatService
     * @description Crea una instancia de ChatService
     * @returns {ChatService}
     * @example
     * const chatService = ChatFactory.createChatService()
     */
    static createChatService() {
        const chatPrismaRepository = new ChatPrismaRepository_1.default();
        return new ChatService_1.default(chatPrismaRepository);
    }
}
exports.ChatFactory = ChatFactory;
