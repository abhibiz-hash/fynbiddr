import { useEffect, useState } from 'react';
import apiClient from '../api/axios';
import type { Auction } from '@/types';
import AuctionCard from '@/components/AuctionCard';

const HomePage = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/auctions');
                setAuctions(response.data);
            } catch (err) {
                setError('Failed to fetch auctions. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <div className="text-center py-10">Loading auctions...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-center">Live Auctions</h1>
            {auctions.length === 0 ? (
                <p className="text-center text-gray-600">No live auctions at the moment. Please check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {auctions.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;