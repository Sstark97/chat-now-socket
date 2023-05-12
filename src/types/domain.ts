import { User, Chat, Message as MessagePrisma } from "@prisma/client"

/**
 * @interface Chats
 * @description Interface para definir la respuesta de un chat
 * @property {number} chat_id - ID del chat
 */
interface Chats {
    chat_id: number
}

interface UserDto {
    user: User
}

interface ChatWithContact {
    id: number
    ChatUsers: UserDto[]
}

interface MessageSocket {
    text: string
    date: Date
    author_id: string
}

interface UserNotify {
    name: string | null
    image: string | null
}

interface ChatRepository {
    getChatId(userId: string, contactId: string): Promise<Chats | null>
    getContactName(contactId: string): Promise<string | null>
    getAllWithContact(userId: string): Promise<ChatWithContact[]>
    getLastMessage(chatId: number): Promise<MessageSocket | null>
    getMessages(chatId: number): Promise<MessagePrisma[]>
    sendMessage(userId: string, contactId: string, message: string): Promise<MessagePrisma>
    create(userId: string, contactId: string): Promise<Chat>
    delete(): Promise<void>
}

interface UserRepository {
    getUserInfo(userId: string): Promise<UserNotify | null>
}

export type { ChatRepository, UserRepository, MessageSocket, UserNotify }