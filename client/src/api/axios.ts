import axios from "axios"

const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true, // Important for sending cookies
})

// We can add an interceptor to automatically attach the auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default apiClient