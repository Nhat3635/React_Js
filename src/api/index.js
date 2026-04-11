import axios from "axios";

const DOMAIN = "http://localhost:3001";

const requestAPI = async ({ method = "GET", url = "", data = {} }) => {
    try {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
        };
        
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await axios({
            method,
            url: `${DOMAIN}${url}`,
            data,
            headers,
        });
        return response;
    } catch (err) {
        console.log("API Error:", err.response?.data || err.message);
        throw err;
    }
};

export default requestAPI;