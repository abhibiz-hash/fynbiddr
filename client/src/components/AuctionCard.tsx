import { Link } from 'react-router-dom';
import type { Auction } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuctionCardProps {
    auction: Auction
    variant?: 'browse' | 'manage'
    onDelete?: (auctionID: string) => void
}

const AuctionCard = ({ auction, variant='browse', onDelete }: AuctionCardProps) => {
    // Placeholder for countdown logic
    const getTimeRemaining = () => {
        const now = new Date()
        const end = new Date(auction.endTime)
        const diff = end.getTime() - now.getTime()
        if (diff <= 0) return "Auction Ended"

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / 1000 / 60) % 60)

        return `${days}d ${hours}h ${minutes}m`
    }

    const handleDelete = () => {
        if (onDelete && window.confirm('Are you sure you want to delete this auction? This cannot be undone.')) {
            onDelete(auction.id)
        }

    }

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
                <p className="text-sm text-gray-500 mb-2">Sold by:
                    <Link to={`/users/${auction.seller.id}`} className="font-semibold text-indigo-600 hover:underline ml-1">
                        {auction.seller.firstName} {auction.seller.lastName}
                    </Link>
                </p>
                <p className="text-lg font-bold text-gray-800">₹{auction.currentPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-2">Ends in: {getTimeRemaining()}</p>
            </CardContent>
            <CardFooter>
                {variant === 'browse' ? (
                    <Button asChild className="w-full">
                        <Link to={`/auctions/${auction.id}`}>View & Bid</Link>
                    </Button>
                ) : (
                    <div className="w-full flex gap-2">
                        <Button asChild variant="outline" className="flex-1">
                            <Link to={`/auctions/${auction.id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                )}

            </CardFooter>
        </Card>
    );
};

export default AuctionCard;
