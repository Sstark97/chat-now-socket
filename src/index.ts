import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import ChatFactory from "./api/factories/ChatFactory"
import UserFactory from "./api/factories/UserFactory";
import type { UserNotify } from "./types/domain";

const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});
const chatService = ChatFactory.createChatService()
const userService = UserFactory.createUserService()

app.get("/", (req, res) => {
    console.log(req)
    res.send("<h1>Hello world</h1>");
});

app.get("/messages", async (req, res) => {
    const { userId, contactId } = req.query

    const messages = await chatService.getMessages(userId as string, contactId as string)

    if (messages !== null) {
        return res.status(200).json(messages)
    }
})

app.get("/chats", async (req, res) => {
    const { userId } = req.query

    const chats = await chatService.getAllWithContact(userId as string)

    if (chats !== null) {
        return res.status(200).json(chats)
    }
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