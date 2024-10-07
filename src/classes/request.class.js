import axios from 'axios';

class AxiosClient {
    constructor(baseURL) {
        this.client = axios.create({
            baseURL,
        });
    }
    async get(url, token) {
        try {
            const response = await this.client.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async post(url, data = {}, token) {
        try {
            let response;

            if (token) {
                response = await this.client.post(url, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                response = await this.client.post(url, data);
            }

            return {
                data: response.data,
                status: response.status
            };

        } catch (error) {
            return this.handleError(error);
        }
    }

    async delete(url, token) {
        try {
            const response = await this.client.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            console.error('Response error:', error.response);
            return error.response.data;
        } else if (error.request) {
            console.error('Request error:', error.request);
            return { error: 'No response received' };
        } else {
            console.error('Error:', error.message);
            return { error: error.message };
        }
    }
}

export default AxiosClient;
