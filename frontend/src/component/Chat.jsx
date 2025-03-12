import { useEffect, useState } from "react";
import io from "socket.io-client";
<<<<<<< HEAD
=======
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Send, UserCircle } from "lucide-react"; // Lucide React icons
>>>>>>> 58e0dd3ea758086083fe3a3060a268196ced1986

// Connect to the backend WebSocket server
const socket = io("http://localhost:5000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

<<<<<<< HEAD
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
=======
  // Apply dark mode on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    if (!user) navigate("/login");
    socket.emit("join", user._id);
  }, [user, navigate]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/auth/users/${user._id}`)
      .then((res) => {
        const sortedUsers = res.data.sort((a, b) =>
          a.username.localeCompare(b.username)
        );
        setUsers(sortedUsers);
      });
  }, [user]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (
        newMessage.senderId === receiver ||
        newMessage.receiverId === user._id
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [receiver, user]);

  const loadMessages = async (receiverId) => {
    setReceiver(receiverId);
    const res = await axios.get(
      `http://localhost:5000/api/chat/${user._id}/${receiverId}`
    );
    setMessages(res.data);
  };

  const sendMessage = () => {
    if (!message.trim() || !receiver) return;
    const newMessage = { senderId: user._id, receiverId: receiver, message };
    socket.emit("sendMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      {/* Sidebar: User List */}
      <div className="w-1/4 border-r p-4 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Chats</h2>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 bg-gray-300 dark:bg-gray-700 rounded-lg transition"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        {users.length ? (
          users.map((u) => (
            <button
              key={u._id}
              onClick={() => loadMessages(u._id)}
              className={`flex items-center w-full p-3 rounded-lg transition ${
                receiver === u._id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <UserCircle size={24} className="mr-2" />
              {u.username}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No other users found</p>
        )}
      </div>

      {/* Chat Area */}
      <div className="w-3/4 p-4 flex flex-col">
        {receiver ? (
          <>
            {/* Chat Header */}
            <h2 className="font-bold text-lg mb-2">
              Chat with{" "}
              {users.find((u) => u._id === receiver)?.username || "User"}
            </h2>

            {/* Messages */}
            <div className="flex-1 border p-4 mb-2 overflow-auto bg-white dark:bg-gray-800 rounded-lg space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 my-1 max-w-lg break-words rounded-lg ${
                    msg.senderId === user._id
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
                  }`}
                  style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex items-center p-2 border rounded-lg bg-white dark:bg-gray-700">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Type a message..."
                style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a user to start chatting</p>
        )}
>>>>>>> 58e0dd3ea758086083fe3a3060a268196ced1986
      </div>
    </div>
  );
};

export default Chat;
