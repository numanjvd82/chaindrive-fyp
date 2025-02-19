import axios from "axios";

export const SERVER_BASE_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

export const axiosInstance = axios.create({
  baseURL: SERVER_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
