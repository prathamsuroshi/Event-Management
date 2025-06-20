
import axios from "axios";

const instance = axios.create({
  baseURL: "https://event-management-5-tjjq.onrender.com",
});


instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
