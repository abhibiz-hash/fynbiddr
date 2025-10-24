import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search, X } from 'lucide-react'

const SearchBar = () => {
   
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

   
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/auctions?search=${encodeURIComponent(searchTerm.trim())}`)
            setIsSearchExpanded(false); 
        }
    };

    return (
        <div className="flex items-center gap-2 transition-all duration-1000 ease-in-out">
            <Button
                variant="default"
                className={`rounded-4xl bg-gray-900 text-white hover:bg-gray-700 shadow-md h-15 w-15 p-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isSearchExpanded ? 'scale-0 opacity-0 w-0' : 'scale-100 opacity-100 w-15 '}`}
                onClick={() => setIsSearchExpanded(true)}
                aria-label="Open search"
                
                style={{ visibility: isSearchExpanded ? 'hidden' : 'visible' }}
            >
                <Search className='!h-5 !w-15' />
            </Button>

            {isSearchExpanded && (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-in fade-in duration-1000"> 
                    <Input
                        type="search"
                        placeholder="Search auctions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-15 rounded-full transition-all duration-1000 ease-in-out w-80" 
                        autoFocus 
                    />
                    <Button
                        type="button" 
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-15 w-15"
                        onClick={() => {
                            setIsSearchExpanded(false);
                            setSearchTerm('');
                        }}
                        aria-label="Close search"
                    >
                        <X className="!h-5 !w-5" />
                    </Button>
                </form>
            )}
        </div>
    )
}

export default SearchBar