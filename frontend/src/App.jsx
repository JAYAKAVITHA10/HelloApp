import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Chat from "./component/Chat.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
