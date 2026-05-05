import { useState } from "react";
import { API_BASE } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      window.location.href = "/dashboard";
      alert("Login successful");
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      
      <form
        onSubmit={handleLogin}
        className="w-87 bg-gray-900 p-6 rounded-xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded font-semibold"
        >
          Login
        </button>
      </form>

    </div>
  );
}