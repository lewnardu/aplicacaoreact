import axios from "axios";

const api = axios.create({
 baseURL: "http://192.168.15.215:8084",
});

export default api