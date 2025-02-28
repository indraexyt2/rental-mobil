import { create } from 'zustand';
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: false,

    clearError: () => set({ error: null }),

    signup: async (fullName, email, password) => {
        try {
            set({ isLoading: true })
            const response = await axios.post(`${API_URL}/api/users/register`, {
                "full_name": fullName,
                "email": email,
                "password": password
            });
            set({ user: response.data, isLoading: false });
        } catch (e) {
            set({ error: e.response.data.errors, isLoading: false });
            console.log("Errors", e.response.data.errors);
            throw e;
        }
    },

    verifyToken: async (token) => {
        try {
            set({ isLoading: true })
            await axios.post(`${API_URL}/api/users/email-verification`, {
                "token": token
            });
            set({ isLoading: false, isAuthenticated: true });
        } catch (e) {
            set({ error: e.response.data.errors, isLoading: false  });
            console.log("Errors", e.response.data.errors);
            throw e;
        }
    },

    login: async (email, password, rememberMe) => {
        try {
            set({ isLoading: true })
            const response = await axios.post(`${API_URL}/api/users/login`, {
                "email": email,
                "password": password,
                "remember_me": rememberMe
            });
            set({ user: response.data, isLoading: false, isAuthenticated: true });
        } catch (e) {
            set({ error: e.response.data.errors, isLoading: false, isAuthenticated: true });
            console.log("Errors", e.response.data.errors);
            throw e;
        }
    },

    resendEmailVerify:  async (email) => {
        try {
            set({ isLoading: true })
            await axios.post(`${API_URL}/api/users/resend-token`, {
                "email": email
            });
            set({ isLoading: false });
        } catch (e) {
            set({ error: e.response.data.errors, isLoading: false });
            console.log("Errors", e.response.data.errors);
            throw e;
        }
    }
}))