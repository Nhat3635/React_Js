import axios from "axios";

const DOMAIN = "http://localhost:3001";

const requestAPI = async ({ method = "GET", url = "", data = {} }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios({
            method,
            url: `${DOMAIN}${url}`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (err) {
        alert(err.response.data.message);
        console.log(err);
    }
};

export default requestAPI;