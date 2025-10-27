import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const AuthStore = create(
  persist(
    (set) => ({
      isLoggingIn: false,
      isSignup: false,
      authUser: null,
      isCheckingAuth: true,
      isLoggingOut: false,
      verificationInProgress: false,
       token: localStorage.getItem("token") || null,

      signup: async (data) => {
        set({ isSignup: true });
        try {
          const response = await axiosInstance.post("/auth/signup", data);
          set({ authUser: response.data });
          localStorage.setItem("token", response.data.token); // ✅ use response.data.token, not data.token
          toast.success("Verify your Email");
          console.log("authUser after signup:", response.data);
        } catch (error) {
          console.error("Signup Error:", error.response?.data || error.message);
          toast.error(error.response?.data?.msg || "Signup failed.");
        } finally {
          set({ isSignup: false });
        }
      },

      verifyUser: async (data) => {
        set({ verificationInProgress: true });
        try {
          const response = await axiosInstance.post("/auth/verify", data);
          set({ authUser: response.data });
          toast.success("Verification successful!");
        } catch (error) {
          console.error("Verification Error:", error.response?.data || error.message);
          console.log("Full error response:", error.response);
          toast.error(error.response?.data?.msg || "Verification failed.");
        } finally {
          set({ verificationInProgress: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const response = await axiosInstance.post("/auth/login", data);
          set({ authUser: response.data });
          localStorage.setItem("token", response.data.token); // ✅ fix here too
          toast.success("Login successful!");
        } catch (error) {
          console.error("Login Error:", error.response?.data || error.message);
          toast.error(error.response?.data?.msg || "Wrong Email or password");
        } finally {
          set({ isLoggingIn: false });
        }
      },
      logout: (navigate) => {
        set({ authUser: null, token: null });
        localStorage.removeItem("token");
        toast.success("Logged out");
        navigate("/login");
      },

      generateImage: async (prompt) => {
        try {
          if (!prompt) {
            toast.error("Please enter a prompt!");
            return;
          }

          toast.info("Generating image... please wait");

          const response = await axiosInstance.post(
            "/ai/generate-image",
            { prompt },
            { responseType: "blob" }
          );

          const imageUrl = URL.createObjectURL(response.data);
          toast.success("Image generated successfully!");
          return imageUrl;
        } catch (error) {
          console.error("Image Generation Error:", error.response?.data || error.message);
          toast.error(error.response?.data?.error || "Failed to generate image.");
        }
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        const token = localStorage.getItem("token");

        if (!token) {
          set({ isCheckingAuth: false, authUser: null });
          return;
        }

        try {
          const response = await axiosInstance.get("/auth/check-auth", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ authUser: response.data });
        } catch (error) {
          console.error("Auth Check Error:", error.response?.data || error.message);
        } finally {
          set({ isCheckingAuth: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        authUser: state.authUser,
        token: state.token,
      }),
    }
  )
);
