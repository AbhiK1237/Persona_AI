// src/api.js - Update with correct backend URL
import axios from 'axios';

// Set your Flask backend URL
const API_URL = 'http://127.0.0.1:5000'; // Make sure this matches your Flask server port

// Create axios instance with custom config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout for AI responses
});

// API function to send a message to the Hitesh AI
export const sendMessage = async (query) => {
    try {
        const response = await api.post('/chat', { query });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export default api;