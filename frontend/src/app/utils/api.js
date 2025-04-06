import axios from "axios";

// Create a new instance of Axios
const api = axios.create({
  baseURL: "http://localhost:3002/api",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Add a request interceptor to modify requests before they are sent
api.interceptors.request.use(
  (config) => {
    // Retrieve the latest token value from the localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Set the token in the request header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request Error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
