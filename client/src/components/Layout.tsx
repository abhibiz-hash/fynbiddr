import { Outlet, Link } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button'

const Layout = () => {
    const { user, logout, isLoading } = useAuth()
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <Link to="/" className="font-bold text-2xl text-gray-900">FynBiddr 🚀</Link>
                    <div className="flex items-center space-x-4">
                        {!isLoading && (
                            user ? (
                                <>
                                    {user.role === 'SELLER' && (
                                        <>
                                            <Button asChild variant="ghost" size="sm">
                                                <Link to="/my-auctions">My Auctions</Link>
                                            </Button>
                                            <Button asChild size="sm">
                                                <Link to="/auctions/new">Create Auction</Link>
                                            </Button>
                                        </>
                                    )}
                                    <Link to={`/users/${user.userId}`} className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                                        My Profile
                                    </Link>
                                    <Button onClick={logout} variant="outline" size="sm">Logout</Button>
                                </>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link to="/login">Login</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link to="/register">Sign Up</Link>
                                    </Button>
                                </>
                            )
                        )}
                    </div>
                </nav>
            </header>

            <main className="flex-grow container mx-auto p-6">
                <Outlet />
            </main>

            <footer className="bg-white">
                <div className="container mx-auto px-6 py-4">
                    <p className="text-center text-gray-600">
                        &copy; 2025 Fynbiddr. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Layout
