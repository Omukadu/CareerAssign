import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Compass } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  // const [email, setEmail] = useState('ava@example.com');
  // const [password, setPassword] = useState('password123');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-brand-50 to-white p-6">
      <form onSubmit={submit} className="card w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white">
            <Compass size={20} />
          </div>
          <div>
            <div className="font-bold">Career Discover</div>
            <div className="text-xs text-gray-500">Library</div>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">
          Login to continue your journey
        </p>
        {err && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
            {err}
          </div>
        )}
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          className="input mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          className="input mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in…" : "Login"}
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">
          No account?{" "}
          <Link to="/register" className="text-brand-700 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
