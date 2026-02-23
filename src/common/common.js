import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const commonApi = async ({
    method = "GET",
    endpoint,
    data = null,
    params = null,
    headers = {}
}) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios({
            method,
            url: `${baseURL}${endpoint}`,
            data,
            params,
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                ...headers
            }
        });

        return response;

    } catch (error) {
        throw error || { message: "Something went wrong" };
    }
};