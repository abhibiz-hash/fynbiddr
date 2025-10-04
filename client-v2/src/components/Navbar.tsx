import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import apiClient from '../api/axios'

import { Button } from './ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Category {
    id: string
    name: string
}

const Navbar = () => {
    const { user, logout, isLoading } = useAuth()
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/Categories')
                setCategories(response.data)
            } catch (err) {
                console.error("Failed to fetch categories ", err)
            }
        }
        fetchCategories()
    }, [])



    return (
        <nav className='w-auto bg-white/60 backdrop-blur-lg border border-gray-200/80 rounded-full shadow lg'>
            <div className='px-6 py-3 flex items-center space-x-8'>
                <Link to="/" className='font-bold text-xl text-gray-900'>Fynbiddr 🚀</Link>

                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem >
                            <NavigationMenuLink asChild>
                                <Link to="/auctions" className={navigationMenuTriggerStyle()}>
                                    All Auctions
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>


                        <DropdownMenu >
                            <DropdownMenuTrigger  className={navigationMenuTriggerStyle()}>
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
                    </NavigationMenuList>
                </NavigationMenu>

                <div className='flex items-center space-x-2'>
                    {!isLoading && (
                        user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className='rounded-full'>My Account</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link to={`/users/${user.userId}`}>My Profile</Link>
                                    </DropdownMenuItem>
                                    {user.role === "SELLER" && <DropdownMenuItem asChild><Link to="/my-auctions"></Link> My Auctions</DropdownMenuItem>}
                                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button asChild variant="ghost"><Link to="/login">Login</Link></Button>
                                <Button asChild className="rounded-full bg-gray-900 hover:bg-gray-800"><Link to="/register">Sign Up</Link></Button>
                            </>
                        )
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
