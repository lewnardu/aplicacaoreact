import axios from "axios";

const api = axios.create({
 baseURL: "https://sgtsispen.sytes.net:8084",
});

export default api