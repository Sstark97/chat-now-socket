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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const ChatFactory_1 = __importDefault(require("./api/factories/ChatFactory"));
const UserFactory_1 = __importDefault(require("./api/factories/UserFactory"));
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    }
});
const chatService = ChatFactory_1.default.createChatService();
const userService = UserFactory_1.default.createUserService();
app.get("/", (req, res) => {
    console.log(req);
    res.send("<h1>Hello world</h1>");
});
app.get("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, contactId } = req.query;
    const messages = yield chatService.getMessages(userId, contactId);
    if (messages !== null) {
        return res.status(200).json(messages);
    }
}));
app.get("/chats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const chats = yield chatService.getAllWithContact(userId);
    if (chats !== null) {
        return res.status(200).json(chats);
    }
}));
io.on("connection", (socket) => {
    console.log("Connected");
    socket.on("join", (obj) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, contactId } = obj;
        yield chatService.create(userId, contactId);
    }));
    socket.on("send-message", (obj) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, contactId, message } = obj;
        const messageInDb = yield chatService.sendMessage(userId, contactId, message);
        const user = yield userService.getUserInfo(userId);
        const { author_id, text } = messageInDb;
        const { name, image } = user;
        const notification = {
            id: author_id,
            name: name,
            message: text,
            image: image !== null && image !== void 0 ? image : ""
        };
        io.emit("receive-message", messageInDb);
        io.emit("reload-chats");
        io.emit("notify", notification);
    }));
});
httpServer.listen(port);
console.log(`Server running on port ${port}`);
