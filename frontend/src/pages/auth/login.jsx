import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import PingPulseLogo from "../../utils/App-Logo";
import { loginSuccess } from "../../redux/user";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    try {
      const serverUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        dispatch(loginSuccess(data));
        toast.success("Logged in Successfully!!");
        navigate("/");
      } else {
        toast.error(data?.message || "Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      toast.error(err || "Invalid credentials");
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 px-6 py-12">
      {/* Logo & Tagline */}
      <div className="flex flex-col items-center mb-12 select-none animate-fadeInDown">
        <PingPulseLogo className="w-40 h-15 text-pink-400 drop-shadow-lg" />
        <h1 className="text-white font-extrabold text-5xl mt-2 tracking-widest font-sans drop-shadow-md">
          PingPulse
        </h1>
        <p className="text-pink-300 mt-2 text-lg italic font-light">
          Feel the pulse of your conversations
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fadeInUp border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wide">
            Welcome Back
          </h2>

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            className="input-field input input-bordered w-full bg-white/20 text-white placeholder-pink-200 focus:bg-white/30 border border-white/30 transition duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="input-field input input-bordered w-full bg-white/20 text-white placeholder-pink-200 focus:bg-white/30 border border-white/30 transition duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {/* Error message */}
          {error && (
            <p className="text-red-400 font-semibold text-center mt-1 animate-pulse">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg shadow-lg shadow-pink-600/50 transition-transform transform hover:scale-105 active:scale-95"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-pink-300 font-light">
          <p>
            New here?{" "}
            <Link
              to="/user/register"
              className="underline hover:text-pink-400 font-semibold transition duration-200"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 1rem;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .input-field:focus {
          outline: none;
          border-color: #ec4899; /* Pink */
          background-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 8px #ec4899aa;
        }
      `}</style>
    </div>
  );
};

export default Login;
