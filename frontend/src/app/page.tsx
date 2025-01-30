"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  reconnection: false,
});

export default function Page() {
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [room, setRoom] = useState("");

  const handleSendMessage = async () => {
    socket.emit("send_message", { message, room });
    setMessage("");
  };

  const handleChangeRoom = async (room:string) => {
    socket.emit("join", { room });
    setMessage("");
    setLogs([]);
    setRoom(room);
  }

  useEffect(() => {
    const handleReceivedMessage = (data: { message: string, room:string }) => {
      console.log(data);
      setLogs((prev) => [...prev, data.message]);
    };

    socket.on("received_message", handleReceivedMessage);

    return () => {
      socket.off("received_message", handleReceivedMessage);
    };
  }, []);

  return (
    <div className="bg-white w-screen h-screen text-black flex">
      <div className="">
        <button
          className="w-80 bg-blue-400 hover:bg-blue-300 transition-colors duration-300 py-2 text-white border-[1px] border-neutral-400 shadow-md"
          onClick={()=>{handleChangeRoom("room1")}}
        >
          room1
        </button>
        <button
          className="w-80 bg-blue-400 hover:bg-blue-300 transition-colors duration-300 py-2 text-white border-[1px] border-neutral-400 shadow-md"
          onClick={() => { handleChangeRoom("room2") }}
        >
          room2
        </button>
      </div>
      <div className="space-y-2 container mx-auto pt-4">
        <p>
          <input
            type="text"
            className="outline-none border-[1px] border-neutral-400 rounded-md px-2 py-1 w-80"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </p>
        <p>
          <button
            type="submit"
            className="w-80 bg-blue-400 hover:bg-blue-300 transition-colors duration-300 py-2 text-white border-[1px] border-neutral-400 shadow-md"
            onClick={handleSendMessage}
          >
            送信
          </button>
        </p>
      </div>
      <div className="text-black space-y-2 container mx-auto pt-4">
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
}