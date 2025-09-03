import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            // Navigate to the All Auctions page with the search query
            navigate(`/auctions?search=${encodeURIComponent(searchTerm.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto">
            <Input
                type="search"
                placeholder="Search for anything..."
                className="rounded-r-none focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" className="rounded-l-none">Search</Button>
        </form>
    )
}

export default SearchBar