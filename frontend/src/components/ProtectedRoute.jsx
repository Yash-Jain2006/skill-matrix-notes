import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = () => {
    const { user } = useAuth()

    // If user is not authenticated, redirect to the login page immediately.
    // If they are, Outlet renders the nested child components (e.g., Dashboard).
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
