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
const cors_1 = __importDefault(require("cors"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const ChatFactory_1 = __importDefault(require("./api/factories/ChatFactory"));
const UserFactory_1 = __importDefault(require("./api/factories/UserFactory"));
const optionsJSDoc = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ChatNow API',
            description: 'API para la aplicación de mensajería instantánea ChatNow y servidor de sockets',
            version: '1.0.0',
        },
    },
    apis: [`${__dirname}/index.js`], // files containing annotations as above
};
const openapiSpecification = (0, swagger_jsdoc_1.default)(optionsJSDoc);
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpecification));
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    }
});
const chatService = ChatFactory_1.default.createChatService();
const userService = UserFactory_1.default.createUserService();
/**
 * @openapi
 * /:
 *   get:
 *     description: Index route
 *     responses:
 *       200:
 *         description: Returns Hello world
 */
// @ts-ignore
app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});
/**
 * @openapi
 *
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         text:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         chat_id:
 *           type: integer
 *         author_id:
 *           type: integer
 *
 * /messages:
 *   get:
 *     description: Obtiene los mensajes de un chat
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario que desea obtener los mensajes
 *       - in: query
 *         name: contactId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contacto con quien se intercambian los mensajes
 *     responses:
 *       '200':
 *         description: Devuelve los mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       '404':
 *         description: Mensajes no encontrados
 */
app.get("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, contactId } = req.query;
    const messages = yield chatService.getMessages(userId, contactId);
    return messages !== null ? res.status(200).json(messages) : res.status(404).json({ message: "Messages not found" });
}));
/**
 * @openapi
 *
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         chat_id:
 *           type: integer
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         image:
 *           type: string
 *         status:
 *           type: string
 *         time:
 *           type: date
 *         message:
 *           type: string
 *         author_id:
 *           type: integer
 *
 * /chats:
 *   get:
 *     description: Obtiene los chats de un usuario
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           required: true
 *           description: ID del usuario que desea obtener los chats
 *     responses:
 *       '200':
 *         description: Devuelve los chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       '404':
 *         description: Chats no encontrados
 */
app.get("/chats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const chats = yield chatService.getAllWithContact(userId);
    return chats !== null ? res.status(200).json(chats) : res.status(404).json({ message: "Chats not found" });
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
