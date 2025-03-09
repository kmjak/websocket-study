"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  reconnection: true,
});

export default function Page() {
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [room, setRoom] = useState<string|null>(null);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send_message", { message, room });
    setMessage("");
  };

  const handleChangeRoom = (newRoom: string) => {
    socket.emit("join", { room: newRoom });
    setRoom(newRoom);
    setLogs([]);
  }

  useEffect(() => {
    const onConnect = () => {
      console.log("サーバーに接続しました");
    };

    const onDisconnect = () => {
      console.log("サーバーから切断されました");
    };

    const handleReceivedMessage = (message: string) => {
      console.log(`メッセージを受信: ${message}`);
      setLogs((prev) => [...prev, message]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("received_message", handleReceivedMessage);
    socket.on("room_changed", (data) => {
      setIsJoined(true);
      setRoom(data.room);
    });

    socket.on("joined",(data)=>{
      setLogs((prev) => [...prev, `${data.user}が入室しました`]);
    })

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("received_message", handleReceivedMessage);
      socket.off("room_changed");
      socket.off("joined");
    };
  }, []);

  return (
    <div className="container h-screen text-black mx-auto">
      <h1 className="text-3xl text-center">現在のroom: {room}</h1>
      <div className="flex w-screen">
        <div className="w-3/12 h-full space-y-6">
        <div className="">
          <button
            className="w-80 bg-blue-400 hover:bg-blue-300 transition-colors duration-300 py-2 text-white border-[1px] border-neutral-400 shadow-md"
            onClick={() => handleChangeRoom("room1")}
          >
            room1
          </button>
          <button
            className="w-80 bg-blue-400 hover:bg-blue-300 transition-colors duration-300 py-2 text-white border-[1px] border-neutral-400 shadow-md"
            onClick={() => handleChangeRoom("room2")}
          >
            room2
          </button>
        </div>
          <div className="">
            <p>
              <input
                type="text"
                className="outline-none border-[1px] border-neutral-400 rounded-md px-2 py-1 w-80"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
            </p>
            <p>
              <button
                type="submit"
                className={`w-80  transition-colors duration-300 py-2 text-white border-[1px] border-neutral-400 shadow-md ${isJoined? "bg-green-400 hover:bg-green-300": "bg-neutral-400 hover:bg-neutral-300"}`}
                onClick={isJoined ? handleSendMessage : undefined}
                disabled={!isJoined}
              >
                送信
              </button>
            </p>
          </div>
        </div>
        <div className="w-9/12">
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
}