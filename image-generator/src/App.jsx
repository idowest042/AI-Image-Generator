import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/SignUp";
import VerifyCode from "./pages/VerifyCode";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthStore } from "./AuthStore/AuthStore";
import { Loader } from "lucide-react";
import Navbar from "./pages/Navbar";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = AuthStore();

  useEffect(() => {
    // ✅ Call it only once on mount
    checkAuth();
  }, []); // no dependencies to avoid infinite loops

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <Loader className="size-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route path="/verify" element={<VerifyCode />} />
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

export default App;
