/** @format */
import axios from "axios";

// عنوان الباك إند الأساسي. غيّره عند النشر (production) إلى الدومين الحقيقي.
const baseURL = "http://localhost:3001";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // فعّلها لاحقًا إن أرسل الباك إند التوكن عبر كوكيز httpOnly
});

export default api;
