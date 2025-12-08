import React from 'react'
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import authApi from '../api/authApi.js';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setMode }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem("auth_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      // Fetch fresh profile (optional) then update auth context
      let user;
      try {
        const prof = await authApi.getProfile();
        user = prof?.user || data?.user;
        login(user);
      } catch {
        user = data?.user;
        login(user);
      }
      toast.success("Login successful!");
      
      // Check user onboarding status and navigate accordingly
      if (!user.type) {
        // No type set - go to onboarding
        navigate("/onboarding");
      } else if (!user.topics || user.topics.length === 0) {
        // Has type but no topics - go to topic selection
        navigate("/topic-selection");
      } else {
        // Has both type and topics - go to main feed
        navigate("/");
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-16 lg:p-20 md:mt-20">
        <div className="w-full max-w-md backdrop-blur-sm bg-white/40 bg-opacity-80 backdrop-blur-lg rounded-[20px] p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Login</h2>
          <div className="text-center mb-4">
            <p className="text-gray-800">Welcome! Please enter your details.</p>
          </div>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className={`w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              Sign In
            </button>
          </form>
          <div className="text-center mt-4">
            <a href="#" className="text-gray-900 hover:underline">
              Forgot your password?
            </a>
          </div>
          <div className="text-center mt-4">
            <button onClick={() => setMode("register")} className="text-gray-900 hover:underline cursor-pointer">
              Create an account
            </button>
          </div>
        </div>
      </div>
  )
}

export default LoginForm
