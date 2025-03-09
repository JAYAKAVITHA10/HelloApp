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

  // ✅ Redirect to login if user is null
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    // ✅ Fetch all users except the logged-in user (refresh every 30 sec)
    const fetchUsers = () => {
      axios.get(`http://localhost:5000/api/auth/users/${user._id}`).then((res) => {
        setUsers(res.data);
      });
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // ✅ Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (
        (newMessage.senderId === receiver && newMessage.receiverId === user?._id) ||
        (newMessage.senderId === user?._id && newMessage.receiverId === receiver)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [receiver, user]);

  // ✅ Load messages when selecting a user
  const loadMessages = async (receiverId) => {
    setReceiver(receiverId);
    const res = await axios.get(`http://localhost:5000/api/chat/${user._id}/${receiverId}`);
    setMessages(res.data);
  };

  // ✅ Send Message
  const sendMessage = () => {
    if (!message.trim() || !receiver) return;

    const newMessage = { senderId: user._id, receiverId: receiver, message };
    socket.emit("sendMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]); // Update UI instantly
    setMessage("");
  };

  // ✅ Ensure user is loaded before rendering
  if (!user) return <p className="text-center text-red-500">Loading...</p>;

  return (
    <div className="flex h-screen">
      {/* Left Panel - User List */}
      <div className="w-1/4 border-r p-4">
        <h2 className="font-bold text-lg">Chats</h2>
        <p className="text-sm text-gray-500">
          Logged in as: <strong className="text-blue-500">{user.username}</strong>
        </p>
        {users.length > 0 ? (
          users.map((u) => (
            <button
              key={u._id}
              onClick={() => loadMessages(u._id)}
              className={`block w-full p-2 mt-2 text-left border rounded ${
                receiver === u._id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {u.username}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No other users found</p>
        )}
      </div>

      {/* Right Panel - Chat Window */}
      <div className="w-3/4 p-4 flex flex-col">
        {receiver ? (
          <>
            <h2 className="font-bold text-lg mb-2">
              Chat with {users.find((u) => u._id === receiver)?.username || "User"}
            </h2>
            <div className="flex-1 border p-4 mb-2 overflow-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 rounded ${
                    msg.senderId === user._id ? "bg-blue-500 text-white self-end" : "bg-gray-300"
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
                className="flex-1 border p-2 rounded"
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2 rounded">
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
