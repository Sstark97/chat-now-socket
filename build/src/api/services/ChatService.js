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
class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    sendMessage(userId, contactId, message) {
        return this.chatRepository.sendMessage(userId, contactId, message);
    }
    getMessages(userId, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield this.chatRepository.getChatId(userId, contactId);
            const chatId = chat === null || chat === void 0 ? void 0 : chat.chat_id;
            return chatId ? this.chatRepository.getMessages(chatId) : [];
        });
    }
    getAllWithContact(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield this.chatRepository.getAllWithContact(userId);
            return yield Promise.all(chats.map((chat) => __awaiter(this, void 0, void 0, function* () {
                const { user } = chat.ChatUsers[0];
                const { id, email, image, status } = user;
                const name = yield this.chatRepository.getContactName(id);
                const lastMessage = yield this.chatRepository.getLastMessage(chat.id);
                const { text, date, author_id } = lastMessage;
                return {
                    chat_id: chat.id,
                    id,
                    name: name !== null && name !== void 0 ? name : email,
                    image,
                    status,
                    time: date,
                    message: text,
                    author_id,
                };
            })));
        });
    }
    create(userId, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatInCommon = yield this.chatRepository.getChatId(userId, contactId);
            if (!chatInCommon) {
                return this.chatRepository.create(userId, contactId);
            }
        });
    }
    delete() {
        this.chatRepository.delete();
    }
}
exports.default = ChatService;
