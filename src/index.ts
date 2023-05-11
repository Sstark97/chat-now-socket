import express from 'express';
import { createServer } from 'http';
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Connected")
    socket.on("join", async (obj) => {
        console.log(obj)
        // const { userId, contactId } = obj
        // await chatService.create(userId, contactId)
    })

    socket.on("send-message", async (obj) => {
        console.log(obj)
        // const { userId, contactId, message } = obj
        // const messageInDb = await chatService.sendMessage(userId, contactId, message)
        // io.emit("receive-message", messageInDb)
        io.emit("reload-chats")
    })
})

httpServer.listen(3000);
console.log("Server running on port 3000")