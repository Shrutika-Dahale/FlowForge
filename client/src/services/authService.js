import axios from "axios";

const API = "https://flowforge-backend-ud7x.onrender.com/api/auth";

export const loginUser = (data) => axios.post(`${API}/login`, data);

export const registerUser = (data) => axios.post(`${API}/register`, data);