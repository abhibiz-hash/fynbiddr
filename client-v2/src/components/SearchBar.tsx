import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search, X } from 'lucide-react'

import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"


const SearchBar = () => {

    const [isSearchExpanded, setIsSearchExpanded] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    // Refs for animation targets
    const containerRef = useRef<HTMLDivElement>(null)
    const iconRef = useRef<HTMLButtonElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)


    useGSAP(() => {
        const icon = iconRef.current
        const form = formRef.current
        const input = inputRef.current

        if (!icon || !form || !input) return

        const targetWidth = 450 

        
        const tl = gsap.timeline()

        if (isSearchExpanded) {
            
            tl.to(icon, { 
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                ease: "power1.in",
                pointerEvents: 'none' 
            })
                .to(form, { 
                    width: targetWidth, 
                    opacity: 1,      
                    duration: 0.3,
                    ease: "power1.out"
                }, "-=0.1") 

            input.focus() 

        } else {
            tl.to(form, { 
                width: 0,       
                opacity: 0,   
                duration: 0.2,
                ease: "power1.in"
            })
                .to(icon, { 
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "power1.out",
                    pointerEvents: 'auto'
                }, "-=0.1") 
        }
    }, { dependencies: [isSearchExpanded], scope: containerRef })


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            navigate(`/auctions?search=${encodeURIComponent(searchTerm.trim())}`)
            setIsSearchExpanded(false)
        }
    }



    return (
        <div ref={containerRef} className="relative flex justify-center items-center h-15"> 
            <Button
                ref={iconRef}
                variant="default"
                className="absolute rounded-full bg-gray-900 hover:scale-125 text-white hover:bg-gray-900 hover:cursor-pointer shadow-md h-15 w-15 p-0 flex items-center justify-center z-10"
                onClick={() => setIsSearchExpanded(true)}
                aria-label="Open search"
            >
                <Search className='!h-6 !w-6 ' />
            </Button>

            <form
                ref={formRef}
                onSubmit={handleSearchSubmit} 
                className="absolute flex items-center gap-2 overflow-hidden h-15 rounded-full bg-white/60 backdrop-blur-lg border border-gray-200/80 shadow-lg"
                style={{ width: 0, opacity: 0 }} 
            >
                <Input
                    ref={inputRef}
                    type="search"
                    placeholder="Search auctions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // Removed fixed width, GSAP controls form width
                    className="flex-grow h-full focus:border-none border-none shadow-none focus-visible:ring-0 bg-transparent pl-4 pr-2" 
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-14 w-14 mr-1 hover:scale-125 hover:bg-transparent hover:cursor-pointer "
                    onClick={() => {
                        setIsSearchExpanded(false);
                        setSearchTerm('');
                    }}
                    aria-label="Close search"
                >
                    <X className="!h-5 !w-5" />
                </Button>
            </form>
        </div>
    )
}

export default SearchBar