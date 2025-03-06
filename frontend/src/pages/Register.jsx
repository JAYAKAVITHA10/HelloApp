import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      console.log("🔹 Sending Data:", formData);
      const res = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 201) {
        console.log("✅ Registration Success:", res.data);
        setMessage("🎉 Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      console.error("❌ Registration Error:", err.response?.data);
      if (err.response?.data?.error === "Email already in use") {
        setMessage("⚠️ Email is already registered! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(err.response?.data?.error || "❌ Registration failed");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Register
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button className="text-blue-500" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
