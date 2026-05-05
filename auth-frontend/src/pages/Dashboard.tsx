import { useEffect, useState } from "react";
import { API_BASE } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ❌ No token → send back to login
    if (!token) {
      navigate("/");
      return;
    }

    // 🔐 Call protected backend route
    fetch(`${API_BASE}/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, []);

  // 🔴 LOGOUT FUNCTION (ADDED HERE)
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-100 text-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {user ? (
          <>
            <p className="text-green-400 mb-2">Welcome 🎉</p>
            <p className="text-sm text-gray-300">
              Email: {user.email}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              User ID: {user.user_id}
            </p>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <button
          onClick={logout}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 transition p-3 rounded font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}