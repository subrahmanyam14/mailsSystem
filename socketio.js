const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    origin: ["http://localhost:3000", ],
    methods: ["GET", "POST", "PUT", "DELETE"],
});

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log(`a user connected with id : ${socket.id}`);
    const userEmail = socket.handshake.query.userEmail;
    if(userEmail !== undefined)
    {
        userSocketMap[userEmail] = socket.id;
        console.log(`a user connected with email and id : ${userEmail} & ${socket.id}`);
    }


    io.emit("getConnectedUsers", Object.keys(userSocketMap));
    io.to("getAllSentMailsByEmail", () => {
    })

    socket.on("disconnect", () => {
        console.log(`A user disconnected with id : ${socket.id}`);
        delete userSocketMap[socket.id];
        io.emit("getConnectedUsers", Object.keys(userSocketMap));
    });
});

module.exports = {getReceiverSocketId, io, server, app};