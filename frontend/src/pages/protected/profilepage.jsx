import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Loader,
  LogOut,
  Pencil,
  User2Icon,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/user";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.userInfo);
  const mode = useSelector((state) => state.theme.mode);

  const [editUsername, setEditUsername] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [loading, setLoading] = useState(false);

  const [usernameInput, setUsernameInput] = useState(user.username);
  const [bioInput, setBioInput] = useState(user.about);
  const [preview, setPreview] = useState(user?.profilePic);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleIconClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/profile/avatar/update`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log("Uploaded avatar:", data);
        if (data.profilePic) {
          toast.success("Profile pic updated successfully!!");
          setPreview(data.profilePic);
        }
      } catch (err) {
        toast.error(err);
        console.error("Backend didn't return JSON:", text);
      }
    } catch (err) {
      toast.error(err);
      console.error("Avatar upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field) => {
    try {
      setLoading(true);
      const serverUrl = import.meta.env.VITE_API_URL;
      const updateData = {};
      if (field === "username") updateData.username = usernameInput;
      else if (field === "bio") updateData.about = bioInput;

      const response = await fetch(`${serverUrl}/api/user/profile/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      toast.success("Profile updated successfully!!");
      console.log(data);
    } catch (error) {
      toast.error(err);
      console.log("Error updating:", error);
    } finally {
      if (field === "username") setEditUsername(false);
      if (field === "bio") setEditBio(false);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const serverUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${serverUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // ensures cookies like 'token' are sent
      });

      dispatch(logout());
      navigate("/user/login");
      localStorage.clear();
      toast.success("Logged out successfully!!");
    } catch (error) {
      toast.error(err);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        mode === "light"
          ? "bg-gradient-to-br from-blue-50 via-white to-gray-50 text-gray-900"
          : "bg-gray-900 text-white"
      }`}
    >
      <div
        className={`w-full max-w-xl p-8 rounded-3xl shadow-lg space-y-6 transition-colors duration-300 ${
          mode === "light"
            ? "bg-white text-gray-900 border border-gray-200"
            : "bg-gray-800 text-white"
        }`}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24">
            {loading ? (
              <div className="w-24 h-24 rounded-full border-4 border-blue-300 flex items-center justify-center bg-blue-50 animate-pulse">
                <Loader className="animate-spin text-blue-500" />
              </div>
            ) : preview ? (
              <img
                src={preview}
                alt="User avatar"
                className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-md object-cover"
              />
            ) : (
              <User2Icon className="w-24 h-24 rounded-full border-4 shadow-md text-blue-300" />
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-blue-300 shadow-md hover:bg-blue-100 transition"
              title="Edit Avatar"
              onClick={handleIconClick}
            >
              <Camera className="w-5 h-5 text-blue-500" />
            </button>
          </div>

          {/* Username */}
          {editUsername ? (
            <div className="flex items-center justify-center gap-2 mt-4">
              <input
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="border-b border-blue-300 px-1 text-center py-0.5 bg-transparent focus:outline-none focus:border-blue-500"
                autoFocus
              />
              {loading ? (
                <Loader className="w-4 h-4 animate-spin text-green-600" />
              ) : (
                <Check
                  onClick={() => handleSave("username")}
                  className="w-5 text-green-600 cursor-pointer hover:text-green-700"
                />
              )}

              <X
                onClick={() => setEditUsername(false)}
                className="w-5 text-red-600 cursor-pointer hover:text-red-700"
              />
            </div>
          ) : (
            <h2 className="mt-4 text-2xl font-semibold flex items-center gap-2 text-blue-800">
              {user.username}
              <Pencil
                onClick={() => {
                  setEditUsername(true);
                  setUsernameInput(user.username);
                }}
                className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700"
              />
            </h2>
          )}
        </div>

        {/* Email */}
        <div className="cursor-not-allowed px-4 py-0.5">
          <h3 className="text-lg font-medium mb-1 flex items-center gap-1 text-blue-700">
            Email
          </h3>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>

        {/* About (Bio) */}
        <div
          className={`hover:bg-blue-50 px-4 py-2 rounded-md  transition-colors duration-300 ${
            mode === "light" ? null : "hover:bg-gray-700 hover:text-white"
          }`}
        >
          <h3 className="text-lg font-medium mb-1 text-blue-700">About</h3>
          {editBio ? (
            <div className="flex gap-2 w-full items-center">
              <input
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="w-full border-b border-blue-300 px-1 bg-transparent focus:outline-none focus:border-blue-500 "
                autoFocus
              />
              {loading ? (
                <Loader className="w-4 h-4 animate-spin text-green-600" />
              ) : (
                <Check
                  onClick={() => handleSave("bio")}
                  className="w-6 text-green-600 cursor-pointer hover:text-green-700"
                />
              )}

              <X
                onClick={() => setEditBio(false)}
                className="w-6 text-red-600 cursor-pointer hover:text-red-700"
              />
            </div>
          ) : (
            <p
              className={`text-sm flex justify-between items-center gap-3 ${
                mode === "light" ? "text-gray-700" : "text-white"
              }`}
            >
              {user?.about || "Hey there! I'm using PingPulse."}
              <Pencil
                onClick={() => {
                  setEditBio(true);
                  setBioInput(user.about || "");
                }}
                className="w-5 cursor-pointer text-blue-500 hover:text-blue-700"
              />
            </p>
          )}
        </div>

        {/* Logout */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleLogout}
            className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition px-4 py-2 rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <Loader /> : <LogOut className="w-5 h-5" />} Logout
          </button>
        </div>
      </div>
    </div>
  );
}
