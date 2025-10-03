import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
})

// Request interceptor to attach the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// CRITICAL FIX: Response interceptor to handle expired tokens
apiClient.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error) => {
    const originalRequest = error.config
    
    // Check if the error is due to an expired token and we haven't retried yet
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true // Mark that we are retrying this request
      try {
        // Call the refresh token endpoint
        const { data } = await apiClient.post('/auth/refresh')
        
        // Update the stored access token
        localStorage.setItem('accessToken', data.accessToken)
        
        // Update the header for the original request and retry it
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
        
        return apiClient(originalRequest)
      } catch (refreshError) {
        // If the refresh token is also invalid, logout the user
        // (In a real app, you'd call a logout function from your auth context here)
        console.error("Session expired. Please login again.")
        localStorage.removeItem('accessToken')
        // Redirect to login page
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient