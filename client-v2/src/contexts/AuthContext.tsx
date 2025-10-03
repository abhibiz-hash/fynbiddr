import React, { createContext, useState, useEffect, useContext } from 'react'
import apiClient from '../api/axios'
import { jwtDecode } from 'jwt-decode'

interface User {
    userId: string
    role: string
}
interface AuthContextType {
    user: User | null;
    login: (token: string) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            try {
                const decodedUser: User = jwtDecode(token)
                setUser(decodedUser)
            } catch (error) {
                console.error("Invalid token:", error)
                localStorage.removeItem('accessToken')
            }
        }
        setIsLoading(false)
    }, [])

    const login = (token: string) => {
        localStorage.setItem('accessToken', token)
        const decodedUser: User = jwtDecode(token)
        setUser(decodedUser)
    }

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error("Server logout failed, clearing client session anyway.");
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
