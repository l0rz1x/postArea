import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://postarea.onrender.com"
    : "http://localhost:5000");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["accessToken"] = token; // backward compatibility
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, token might be invalid
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on check route to avoid loop
      if (!error.config.url.includes("/auth/check")) {
        // Optional: clear token if needed
      }
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
