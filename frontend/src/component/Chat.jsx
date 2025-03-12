import { useEffect, useState } from "react";
import io from "socket.io-client";

// Connect to the backend WebSocket server
const socket = io("http://localhost:5000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Listen for messages from the server
  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("message");
  }, []);

  // Send message to the server
  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
      <div className="w-96 border p-4 rounded shadow bg-white">
        <div className="h-40 overflow-y-auto border-b mb-2 p-2">
          {messages.map((msg, i) => (
            <p key={i} className="p-1">
              {msg}
            </p>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 flex-1 rounded-l"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
