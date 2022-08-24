import axios from "axios";

const api = axios.create({
 baseURL: "http://sgtsispen.sytes.net:8084",
});

export default api