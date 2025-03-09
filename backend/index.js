import express from "express";
import { createServer } from 'node:http';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const port = 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("接続されました", socket.id);
  let currentRoom = null;
  socket.join(currentRoom);

  socket.on("send_message", (data) => {
    io.to(data.room).emit("received_message", `${socket.id} >>>  ${data.message}`);
  });

  socket.on("join", (data) => {
    socket.leave(currentRoom);

    socket.join(data.room);
    currentRoom = data.room;

    socket.emit("room_changed", { room: currentRoom });
    socket.to(currentRoom).emit("joined", { user: socket.id });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} が切断されました`);
  });
});