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
  console.log("接続されました");
  socket.on("send_message", (data) => {
    console.log(data);
    io.to(data.room).emit("received_message", data.message);
  });
  socket.on("join", (data) => {
    console.log("--"+data);
    socket.join(data.room);
  });
  socket.on("disconnect", () => {
    console.log("切断されました");
  });
});