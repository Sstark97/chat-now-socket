import {ChatRepository, ChatWithAll, MessageSocket} from "../../types/domain"

/**
 * @class ChatService
 * @description Clase para definir el servicio de chats
 * @property {ChatRepository} chatRepository - Repositorio de chats
 */
class ChatService {
    constructor(private readonly chatRepository: ChatRepository) {}

    /**
     * @function sendMessage
     * @param userId {string}
     * @param contactId {string}
     * @param message {string}
     * @description Envía un mensaje
     * @returns {Promise<Message>}
     */
    sendMessage(userId: string, contactId: string, message: string) {
        return this.chatRepository.sendMessage(userId, contactId, message)
    }

    /**
     * @function getMessages
     * @param userId {string}
     * @param contactId {string}
     * @description Obtiene los mensajes de un chat
     * @returns {Promise<Message[]>}
     */
    async getMessages(userId: string, contactId: string) {
        const chat = await this.chatRepository.getChatId(userId, contactId)
        const chatId = chat?.chat_id

        return chatId ? this.chatRepository.getMessages(chatId) : []
    }

    /**
     * @function getAllWithContact
     * @param userId {string}
     * @description Obtiene todos los chats con su contacto
     * @returns {Promise<ChatWithAll[]>}
     */
    async getAllWithContact(userId: string): Promise<ChatWithAll[]> {
        const chats = await this.chatRepository.getAllWithContact(userId)
        return await Promise.all(
            chats.map(async (chat) => {
                const { user } = chat.ChatUsers[0]
                const { id, email, image, status } = user
                const name = await this.chatRepository.getContactName(id)
                const lastMessage = await this.chatRepository.getLastMessage(chat.id)
                const { text, date, author_id } = lastMessage as MessageSocket

                return {
                    chat_id: chat.id,
                    id,
                    name: name ?? email,
                    email,
                    image,
                    status,
                    time: date,
                    message: text,
                    author_id,
                }
            })
        )
    }

    /**
     * @function create
     * @param userId {string}
     * @param contactId {string}
     * @description Crea un chat
     * @returns {Promise<Chats | undefined>}
     */
    async create(userId: string, contactId: string) {
        const chatInCommon = await this.chatRepository.getChatId(userId, contactId)

        if (!chatInCommon) {
            return this.chatRepository.create(userId, contactId)
        }
    }

    /**
     * @function delete
     * @description Elimina un chat
     * @returns {Promise<void>}
     */
    delete() {
        this.chatRepository.delete()
    }
}

export default ChatService
