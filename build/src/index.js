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
const ChatFactory_1 = require("../src/api/factories/ChatFactory");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
const chatService = ChatFactory_1.ChatFactory.createChatService();
app.get("/", (req, res) => {
    console.log(req);
    res.send("<h1>Hello world</h1>");
});
io.on("connection", (socket) => {
    console.log("Connected");
    socket.on("join", (obj) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, contactId } = obj;
        yield chatService.create(userId, contactId);
    }));
    socket.on("send-message", (obj) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, contactId, message } = obj;
        const messageInDb = yield chatService.sendMessage(userId, contactId, message);
        io.emit("receive-message", messageInDb);
        io.emit("reload-chats");
    }));
});
httpServer.listen(3000);
console.log("Server running on port 3000");
