import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8084", // Your Spring Boot backend URL and port
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set the JWT token in the Authorization header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Check for existing token on app load
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

export { api };