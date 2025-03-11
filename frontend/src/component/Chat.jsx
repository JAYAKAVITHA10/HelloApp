// Updated Chat UI with Dark/Light Mode & Sorted User List
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
    socket.emit("join", user._id);
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
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
    <div
      className={`flex h-screen ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="w-1/4 border-r p-4 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Chats</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-300 dark:bg-gray-600 rounded"
          >
            {darkMode ? "🌙" : "☀️"}
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
              <span className="mr-2 text-lg">🔵</span> {u.username}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No other users found</p>
        )}
      </div>

      <div className="w-3/4 p-4 flex flex-col">
        {receiver ? (
          <>
            <h2 className="font-bold text-lg mb-2">
              Chat with{" "}
              {users.find((u) => u._id === receiver)?.username || "User"}
            </h2>
            <div className="flex-1 border p-4 mb-2 overflow-auto bg-white dark:bg-gray-800 rounded-lg">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 max-w-xs rounded-lg ${
                    msg.senderId === user._id
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border p-2 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
