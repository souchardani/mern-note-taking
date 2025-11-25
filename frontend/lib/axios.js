import axios from "axios";

//in production, there is no localhost so we have to make it dynamic
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL, // no habia cambiado esto
});

export default api;
