import { useEffect, useState, useCallback } from 'react'; // FIX: Added useCallback
import apiClient from '../api/axios';
import type { Auction } from '@/types';
import AuctionCard from '@/components/AuctionCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const AllAuctionsPage = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for filters and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('ACTIVE');
    const [sortBy, setSortBy] = useState('endTime-asc');

    const fetchAuctions = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                status: status,
                sortBy: sortBy,
            });
            if (searchTerm) {
                params.append('search', searchTerm);
            }
            const response = await apiClient.get(`/auctions?${params.toString()}`);
            setAuctions(response.data);
        } catch (err) {
            setError('Failed to fetch auctions.');
        } finally {
            setLoading(false);
        }
    }, [status, sortBy, searchTerm]);

    useEffect(() => {
        // We don't need to call fetchAuctions here, as the dropdowns will trigger it on their first render.
        // This prevents a double-fetch on page load.
    }, []); 

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page refresh on form submission
        fetchAuctions();
    };
    
    // Trigger a fetch whenever the filters or sorting change
    useEffect(() => {
        fetchAuctions();
    }, [fetchAuctions, status, sortBy]);


    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold mb-4">All Auctions</h1>
            <p className="text-gray-600 mb-8">Browse, search, and find your next treasure.</p>

            {/* Filter and Sort Controls */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3 flex gap-2">
                        <Input
                            placeholder="Search by keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow"
                        />
                        <Button type="submit">Search</Button>
                    </div>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="PENDING">Upcoming</SelectItem>
                            <SelectItem value="SOLD">Sold</SelectItem>
                            <SelectItem value="FINISHED">Finished (No Bids)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="endTime-asc">Ending Soonest</SelectItem>
                            <SelectItem value="createdAt-desc">Newly Listed</SelectItem>
                            <SelectItem value="currentPrice-desc">Highest Price</SelectItem>
                            <SelectItem value="currentPrice-asc">Lowest Price</SelectItem>
                        </SelectContent>
                    </Select>
                </form>
            </div>
            
            {/* FIX: Removed the duplicate Select components that were here */}
            
            {loading ? (
                <div className="text-center py-10">Loading auctions...</div>
            ) : auctions.length === 0 ? (
                <p className="text-center text-gray-600 py-10">No auctions found matching your criteria.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {auctions.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    ))}
                </div>
            )}
        </div> // FIX: Correctly closing the main container div
    );
};

export default AllAuctionsPage;