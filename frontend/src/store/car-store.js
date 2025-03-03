import { create } from 'zustand';
import axios from 'axios';

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
    pagination: {
        page: 1,
        limit: 10,
        total_data: 0,
        total_page: 1
    },

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

    addCar: async (carData) => {
        try {
            set({ isLoading: true });
            const formData = new FormData();

            // Add text data
            Object.keys(carData).forEach(key => {
                if (key === 'car') {
                    // Handle car images - multiple file uploads
                    carData.car.forEach(imageFile => {
                        formData.append('car', imageFile);
                    });
                } else if (key === 'categories' || key === 'features') {
                    // Handle arrays
                    formData.append(key, JSON.stringify(carData[key]));
                } else {
                    // Handle other form fields
                    formData.append(key, carData[key]);
                }
            });

            const response = await axios.post(`${API_URL}/api/cars`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            set({ car: response.data.data, isLoading: false });
            return response.data;
        } catch (e) {
            set({ error: e.response?.data?.errors || e.message, isLoading: false });
            console.log("Errors", e.response?.data?.errors || e.message);
            throw e;
        }
    },

    getCars: async (queryParams = '') => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${API_URL}/api/cars${queryParams ? `?${queryParams}` : ''}`);
            set({
                cars: response.data.data.cars,
                pagination: response.data.data.pagination,
                isLoading: false
            });
            return response.data;
        } catch (e) {
            set({ error: e.response?.data?.errors || e.message, isLoading: false });
            console.log("Errors", e.response?.data?.errors || e.message);
            throw e;
        }
    },

    getCar: async (carId) => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${API_URL}/api/cars/${carId}`);
            set({ car: response.data.data, isLoading: false });
            return response.data;
        } catch (e) {
            set({ error: e.response?.data?.errors || e.message, isLoading: false });
            console.log("Errors", e.response?.data?.errors || e.message);
            throw e;
        }
    },

    updateCar: async (carId, carData) => {
        try {
            set({ isLoading: true });
            const formData = new FormData();

            Object.keys(carData).forEach(key => {
                if (key === 'car' && Array.isArray(carData.car)) {
                    carData.car.forEach(imageFile => {
                        if (imageFile instanceof File) {
                            formData.append('car', imageFile);
                        }
                    });
                } else if (key === 'categories' || key === 'features') {
                    formData.append(key, JSON.stringify(carData[key]));
                } else {
                    formData.append(key, carData[key]);
                }
            });

            const response = await axios.put(`${API_URL}/api/cars/${carId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            set({ car: response.data.data, isLoading: false });
            return response.data;
        } catch (e) {
            set({ error: e.response?.data?.errors || e.message, isLoading: false });
            console.log("Errors", e.response?.data?.errors || e.message);
            throw e;
        }
    },

    deleteCar: async (carId) => {
        try {
            set({ isLoading: true });
            await axios.delete(`${API_URL}/api/cars/${carId}`);
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