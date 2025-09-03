import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import type { Auction } from '@/types';
import AuctionCard from '@/components/AuctionCard';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch only active auctions, sorted by ending soonest
        const response = await apiClient.get('/auctions?status=ACTIVE&sortBy=endTime&sortOrder=asc');
        // Take the first 4 as "featured"
        setFeaturedAuctions(response.data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch featured auctions:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* We will add the Tiptap-style hero section here later during the polish phase */}
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold">Bid Smarter, Win Faster</h1>
        <p className="text-xl text-gray-600 mt-4">The future of real-time online auctions.</p>
      </div>
      
      <h2 className="text-3xl font-bold mb-8 text-center">Ending Soon</h2>
      {featuredAuctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      ) : (
         <p className="text-center text-gray-600">No active auctions right now.</p>
      )}
      <div className="text-center mt-12">
        <Button asChild size="lg">
            <Link to="/auctions">Browse All Auctions</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;