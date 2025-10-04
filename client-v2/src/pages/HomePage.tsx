import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import apiClient from '../api/axios'
import type { Auction } from '@/types'
import AuctionCard from '@/components/AuctionCard'


const HomePage = () => {

    const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([])

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await apiClient.get("/auctions?sortBy=createdAt-desc")
                setFeaturedAuctions(response.data.slice(0, 4))
            } catch (err) {
                console.error("Failed to fetch featured auctions:", err)
            }
        }
        fetchFeatured()
    }, [])


    return (
        <div>
            <header className="relative overflow-hidden -mt-20 isolate">
                <div className='relative z-10 container mx-auto px-6 pt-32 pb-24 md:pt-48 text-center'>
                    <h1 className='text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter text-gray-900'>
                        Bid Smarter,&nbsp;
                        <br className="md:hidden" />
                        <span className=' bg-black italic rounded-xl px-6 text-center text-white'>Win Faster</span>
                    </h1>
                    <p className='mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-600'>
                        Experience the thrill of live bidding from anywhere. Our platform ensures every bid is instant, secure, and fair.
                    </p>
                    <div className='mt-8'>
                        <Button asChild size="lg" className='bg-gray-900 text-white font-bold hover:bg-gray-800 py-6 px-8 text-lg rounded-full shadow-lg transition-transform transform hover:scale-105'>
                            <Link to="/auctions">Explore Live Auctions</Link>
                        </Button>
                    </div>
                </div>
            </header>
            <div className='container mx-auto px-6 py-16'>
                <h2 className='text-3xl font-bold mb-8 text-center'>Newly Listed</h2>
                {featuredAuctions.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {featuredAuctions.map((auction) => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No auctions right now. Check back soon!</p>
                )}
            </div>
        </div>
    )
}

export default HomePage