import { create } from 'zustand';
import axios from 'axios';
import feature from "@/components/admin/feature/feature.jsx";

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;


export const useCarStore = create((set) => ({
    car: null,
    cars: null,
    model: null,
    models: null,
    feature: null,
    features: null,
    error: null,
    isLoading: false,

    addModel: async (modelName) => {
        try {
            set({ isLoading: true });
            const response = await axios.post(`${API_URL}/api/cars/category`, {
                "category_name": modelName
            });
            set({ model: response.data.data, isLoading: false });
        } catch (e) {
            set({ error: e.response.data.errors, isLoading: false });
            console.log("Errors", e.response.data.errors);
            throw e;
        }
    },

    getModels: async () => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${API_URL}/api/cars/category/all`);
            set({ models: response.data.data, isLoading: false });
        } catch (e) {
            set({ error: e.response.data.errors, isLoading: false });
            console.log("Errors", e.response.data.errors);
            throw e;
        }
    },

    updateModel: async (modelName, modelId) => {
        try {
            set({ isLoading: true });
            const response = await axios.put(`${API_URL}/api/cars/category/${modelId}`, {
                "category_name": modelName
            });
            set({ model: response.data.data, isLoading: false });
        } catch (e) {
            set({ error: e.response.data.errors, isLoading: false });
            console.log("Errors", e.response.data.errors);
            throw e;
        }
    },

    deleteModel: async (modelId) => {
        try {
            set({ isLoading: true });
            await axios.delete(`${API_URL}/api/cars/category/${modelId}`);
            set({ isLoading: false });
        } catch (e) {
            set({ error: e.response.data.errors, isLoading: false });
            console.log("Errors", e.response.data.errors);
            throw e;
        }
    },

    addFeature: async (featureName) => {
        try {
            set({ isLoading: true });
            const response = await axios.post(`${API_URL}/api/cars/feature`, {
                "feature_name": featureName
            });
            set({ feature: response.data.data, isLoading: false });
        } catch (e) {
            set({ error: e.response?.data?.errors || e.message, isLoading: false });
            console.log("Errors", e.response?.data?.errors || e.message);
            throw e;
        }
    },

    getFeatures: async () => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${API_URL}/api/cars/feature/all`);
            set({ features: response.data.data, isLoading: false });
            console.log(response.data.data)
        } catch (e) {
            set({ error: e.response?.data?.errors || e.message, isLoading: false });
            console.log("Errors", e.response?.data?.errors || e.message);
            throw e;
        }
    },

    updateFeature: async (featureName, featureId) => {
        try {
            set({ isLoading: true });
            const response = await axios.put(`${API_URL}/api/cars/feature/${featureId}`, {
                "feature_name": featureName
            });
            set({ feature: response.data.data, isLoading: false });
        } catch (e) {
            set({ error: e.response?.data?.errors || e.message, isLoading: false });
            console.log("Errors", e.response?.data?.errors || e.message);
            throw e;
        }
    },

    deleteFeature: async (featureId) => {
        try {
            set({ isLoading: true });
            await axios.delete(`${API_URL}/api/cars/feature/${featureId}`);
            set({ isLoading: false });
        } catch (e) {
            set({ error: e.response?.data?.errors || e.message, isLoading: false });
            console.log("Errors", e.response?.data?.errors || e.message);
            throw e;
        }
    },

    resetError: () => {
        set({ error: null });
    }
}));