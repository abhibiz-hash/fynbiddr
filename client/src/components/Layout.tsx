import { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import apiClient from '../api/axios'
import SearchBar from './SearchBar' // 

import { Button } from './ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Category {
    id: string
    name: string
}

const Layout = () => {
    const { user, logout, isLoading } = useAuth()
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categories')
                setCategories(response.data)
            } catch (err) {
                console.error("Failed to fetch categories for layout", err)
            }
        }
        fetchCategories()
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <Link to="/" className="font-bold text-2xl text-gray-900">Fynbiddr 🚀</Link>

                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link to="/auctions">
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        All Auctions
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className={navigationMenuTriggerStyle()}>
                                        Categories
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {categories.map(cat => (
                                            <DropdownMenuItem key={cat.id} asChild>
                                                <Link to={`/auctions?category=${cat.id}`}>{cat.name}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex items-center space-x-2">
                        {!isLoading && (
                            user ? (
                                <>
                                    {user.role === 'SELLER' && (
                                        <Button asChild size="sm">
                                            <Link to="/auctions/new">Create Auction</Link>
                                        </Button>
                                    )}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">My Account</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem asChild><Link to={`/users/${user.userId}`}>My Profile</Link></DropdownMenuItem>
                                            {user.role === 'SELLER' && <DropdownMenuItem asChild><Link to="/my-auctions">My Auctions</Link></DropdownMenuItem>}
                                            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
                                    <Button asChild size="sm"><Link to="/register">Sign Up</Link></Button>
                                </>
                            )
                        )}
                    </div>
                </nav>
            </header>

            {/* Search Bar Section */}
            <div className="bg-white border-b py-4">
                <div className="container mx-auto px-6">
                    <SearchBar />
                </div>
            </div>

            <main className="flex-grow container mx-auto p-6">
                <Outlet />
            </main>

            <footer className="bg-white border-t">
                <div className="container mx-auto px-6 py-4">
                    <p className="text-center text-gray-600">&copy; 2025 Fynbiddr. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Layout