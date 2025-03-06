import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/chat");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-lg text-white">
        <input className="p-2 rounded mb-2 w-full" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="p-2 rounded mb-2 w-full" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-500 px-4 py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;
