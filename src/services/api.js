import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

/**
 * Send user prompt to backend and get architecture design
 * @param {string} userPrompt
 * @returns {Promise<object>} architecture data
 */
export const generateArchitecture = async (userPrompt) => {
  const response = await apiClient.post('/user/input', { user_prompt: userPrompt });
  return response.data;
};

export default apiClient;
