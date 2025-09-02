import { Link } from 'react-router-dom';
import type { Auction } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuctionCardProps {
    auction: Auction;
}

const AuctionCard = ({ auction }: AuctionCardProps) => {
    // Placeholder for countdown logic
    const getTimeRemaining = () => {
        const now = new Date();
        const end = new Date(auction.endTime);
        const diff = end.getTime() - now.getTime();
        if (diff <= 0) return "Auction Ended";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);

        return `${days}d ${hours}h ${minutes}m`;
    };

    return (
        <Card className="w-full flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
            <CardHeader>
                {/* Placeholder for Image */}
                <div className="bg-gray-200 h-48 w-full rounded-md flex items-center justify-center">
                    <span className="text-gray-500">Image</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <CardTitle className="text-lg font-bold mb-2 truncate">{auction.title}</CardTitle>
                <div className="text-sm text-gray-600">
                    <p>Time Remaining: <span className="font-semibold">{getTimeRemaining()}</span></p>
                    <p>Current Bid: <span className="font-semibold text-indigo-600 text-lg">₹{auction.currentPrice.toFixed(2)}</span></p>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link to={`/auctions/${auction.id}`}>View & Bid</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default AuctionCard;
