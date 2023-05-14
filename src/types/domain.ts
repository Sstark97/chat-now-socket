import { User, Chat, Message as MessagePrisma } from "@prisma/client"

/**
 * @interface Chats
 * @description Interface para definir la respuesta de un chat
 * @property {number} chat_id - ID del chat
 */
interface Chats {
    chat_id: number
}

/**
 * @interface UserDto
 * @description Interface para definir la respuesta de un usuario
 * @property {User} user - Usuario
 */
interface UserDto {
    user: User
}

/**
 * @interface ChatWithContact
 * @description Interface para definir la respuesta de un chat con su contacto
 * @property {number} id - ID del chat
 * @property {UserDto[]} ChatUsers - Usuarios del chat
 */
interface ChatWithContact {
    id: number
    ChatUsers: UserDto[]
}

/**
 * @interface ChatWithAll
 * @description Interface para definir la respuesta de un chat con su contacto
 * @property {number} chat_id - ID del chat
 * @property {string} id - ID del usuario
 * @property {string} name - Nombre del usuario
 * @property {string} email - Email del usuario
 * @property {string} image - Imagen del usuario
 * @property {string} status - Estado del usuario
 * @property {Date} time - Fecha del último mensaje
 * @property {string} message - Último mensaje
 * @property {string} author_id - ID del autor del último mensaje
 */
interface ChatWithAll {
    chat_id: number
    id: string
    name: string | null
    email: string | null
    image: string | null
    status: string
    time: Date
    message: string
    author_id: string
}


/**
 * @interface MessageSocket
 * @description Interface para definir la respuesta de un mensaje
 * @property {string} text - Texto del mensaje
 * @property {Date} date - Fecha del mensaje
 * @property {string} author_id - ID del autor del mensaje
 */
interface MessageSocket {
    text: string
    date: Date
    author_id: string
}

/**
 * @interface UserNotify
 * @description Interface para definir la respuesta de un usuario
 * @property {string} name - Nombre del usuario
 * @property {string} image - Imagen del usuario
 */
interface UserNotify {
    name: string | null
    image: string | null
}

/**
 * @interface ChatRepository
 * @description Interface para definir los métodos de un repositorio de chats
 * @property {function} getChatId - Obtiene el ID de un chat
 * @property {function} getContactName - Obtiene el nombre de un contacto
 * @property {function} getAllWithContact - Obtiene todos los chats con su contacto
 * @property {function} getLastMessage - Obtiene el último mensaje de un chat
 * @property {function} getMessages - Obtiene los mensajes de un chat
 * @property {function} sendMessage - Envía un mensaje
 * @property {function} create - Crea un chat
 * @property {function} delete - Elimina un chat
 */
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

/**
 * @interface UserRepository
 * @description Interface para definir los métodos de un repositorio de usuarios
 * @property {function} getUserInfo - Obtiene la información de un usuario
 */
interface UserRepository {
    getUserInfo(userId: string): Promise<UserNotify | null>
}

export type { ChatRepository, UserRepository, MessageSocket, UserNotify, ChatWithAll }