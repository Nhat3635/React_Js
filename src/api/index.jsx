import axios from "axios";

const DOMAIN = "http://localhost:3001";

const requestAPI = async ({ method = "GET", url = "", data = {}, headers = {}, skipAuth = false }) => {
    try {
        const token = localStorage.getItem("token");
        const requestHeaders = {
            ...headers,
        };

        if (!skipAuth && token) {
            requestHeaders.Authorization = `Bearer ${token}`;
        }

        const response = await axios({
            method,
            url: `${DOMAIN}${url}`,
            data,
            headers: requestHeaders,
        });
        return response;
    } catch (err) {
        console.log(err);
        const message = err?.response?.data?.message || err?.response?.data?.error || "Yeu cau that bai";
        throw new Error(message);
    }
};

export default requestAPI;