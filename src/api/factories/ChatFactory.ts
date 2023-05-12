import ChatPrismaRepository from "../repositories/ChatPrismaRepository"
import ChatService from "../services/ChatService"

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
        const chatPrismaRepository = new ChatPrismaRepository()
        return new ChatService(chatPrismaRepository)
    }
}

export default ChatFactory
