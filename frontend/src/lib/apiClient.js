import axios from 'axios'
import { supabase } from './supabase'

// Create Axios default instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add an interceptor to automatically inject the Supabase JWT
apiClient.interceptors.request.use(
    async (config) => {
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession()

        if (session?.access_token && !error) {
            config.headers.Authorization = `Bearer ${session.access_token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiClient
