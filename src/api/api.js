import axios from "axios";

const api = axios.create({
 baseURL: "https://aplicacaoreact-six.vercel.app",
});

export default api