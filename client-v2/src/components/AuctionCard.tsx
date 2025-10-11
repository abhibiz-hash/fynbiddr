import { useState, useEffect } from 'react'
import type { Auction } from '@/types'
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

//Auction card
interface AuctionCardProps {
    auction: Auction;
}
const AuctionCard = ({ auction }: AuctionCardProps) => {

    const [timeRemaining, setTimeRemaining] = useState('')

    useEffect(() => {
        const calculateTimeRemaining = async () => {
            const now = new Date()
            const end = new Date(auction.endTime)
            const diff = end.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeRemaining("Auction Ended")
                return
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((diff / 1000 / 60) % 60)
            const seconds = Math.floor((diff / 1000) % 60)

            setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        }
        calculateTimeRemaining()

        const interval = setInterval(calculateTimeRemaining, 1000)

        return () => clearInterval(interval)

    }, [auction.endTime])


    return (
        <Card>
            <CardHeader className='p-0'>
                {/* We'll add real images later. For now, a placeholder. */}
                <div className='aspect-square bg-gray-100 flex items-center justify-center'>
                    <span className='text-gray-400'>No Image</span>
                </div>
            </CardHeader>
            <CardContent className='p-4 flex-grow'>
                <CardTitle>{auction.title}</CardTitle>
                <p className='text-lg font-bold text-gray-800 mt-2'>{auction.currentPrice.toFixed(2)}</p>
                <p className='text-xs text-gray-500 mt-1'>Ends in: {timeRemaining}</p>
                {/* Other details like price will go here */}
            </CardContent>
            <CardFooter className='p-4 pt-0'>
                <Button asChild className='w-full'>
                    <Link to={`/auctions/${auction.id}`}>View & Bid</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default AuctionCard
