import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { ChatFactory } from "../src/api/factories/ChatFactory"

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);
const httpServer = createServer(app);
const io = new Server(httpServer);
const chatService = ChatFactory.createChatService()

app.get("/", (req, res) => {
    console.log(req)
    res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
    console.log("Connected")
    socket.on("join", async (obj) => {
        const { userId, contactId } = obj
        await chatService.create(userId, contactId)
    })

    socket.on("send-message", async (obj) => {
        const { userId, contactId, message } = obj
        const messageInDb = await chatService.sendMessage(userId, contactId, message)
        io.emit("receive-message", messageInDb)
        io.emit("reload-chats")
    })
})

httpServer.listen(3000);
console.log("Server running on port 3000")