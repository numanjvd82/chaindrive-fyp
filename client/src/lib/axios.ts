import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
