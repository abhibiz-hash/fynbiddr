import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import apiClient from '../api/axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const LoginPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            const response = await apiClient.post('/auth/login', { email, password })
            login(response.data.accessToken)
            navigate('/')
        } catch (err) {
            setError('Failed to log in. Please check your credentials.')
            console.error(err)
        }
    }

    return (
        <div className="flex justify-center items-center py-15">
            <Card className="w-full mx-auto max-w-md bg-white/60 backdrop-blur-lg border-gray-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your email and password below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="abc@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="underline">Sign up</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage
