import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config";

// Shared axios instance — attaches the stored JWT to every request so
// protected backend routes (history, images, diagnosis, admin writes) work.
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
