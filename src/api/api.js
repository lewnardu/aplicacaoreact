import axios from "axios";

const api = axios.create({
 baseURL: "http://sgtsispen.sytes.net:8086",
});

export default api