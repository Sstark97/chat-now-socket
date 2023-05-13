import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { createServer } from "http";
import { Server } from "socket.io";
import ChatFactory from "./api/factories/ChatFactory"
import UserFactory from "./api/factories/UserFactory";
import type { UserNotify } from "./types/domain";

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

const openapiSpecification = swaggerJSDoc(optionsJSDoc);

const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});
const chatService = ChatFactory.createChatService()
const userService = UserFactory.createUserService()

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
app.get("/messages", async (req, res) => {
    const { userId, contactId } = req.query

    const messages = await chatService.getMessages(userId as string, contactId as string)

    return messages !== null ? res.status(200).json(messages) : res.status(404).json({ message: "Messages not found" })
})

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
app.get("/chats", async (req, res) => {
    const { userId } = req.query

    const chats = await chatService.getAllWithContact(userId as string)

    return chats !== null ? res.status(200).json(chats) : res.status(404).json({ message: "Chats not found" })
})

io.on("connection", (socket) => {
    console.log("Connected")
    socket.on("join", async (obj) => {
        const { userId, contactId } = obj
        await chatService.create(userId, contactId)
    })

    socket.on("send-message", async (obj) => {
        const { userId, contactId, message } = obj
        const messageInDb = await chatService.sendMessage(userId, contactId, message)
        const user = await userService.getUserInfo(userId) as UserNotify
        const { author_id, text} = messageInDb
        const { name, image } = user
        const notification = {
            id: author_id,
            name: name,
            message: text,
            image: image ?? ""
        }

        io.emit("receive-message", messageInDb)
        io.emit("reload-chats")
        io.emit("notify", notification)
    })
})

httpServer.listen(port);
console.log(`Server running on port ${port}`)