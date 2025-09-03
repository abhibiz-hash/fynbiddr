import { useState, useEffect } from "react"
import apiClient from "../api/axios"
import type { Auction } from "@/types"
import AuctionCard from "@/components/AuctionCard"


const MyAuctionsPage = () => {
    const [myAuctions, setMyAuctions] = useState<Auction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMyAuctions = async () => {
            try {
                setLoading(true)
                const response = await apiClient.get('/auctions/my-auctions')
                setMyAuctions(response.data)
            } catch (error) {
                setError('Failed to fetch your auctions. Please try again later.');
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchMyAuctions()
    }, [])
    if (loading) {
        return <div className="text-center py-10">Loading your auctions...</div>
    }
    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>
    }

    return (
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Auctions Dashboard</h1>
                <p className="text-gray-600">Here are all the auctions you have created.</p>
            </div>
            {myAuctions.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold">You haven't created any auctions yet.</h3>
                    <p className="text-gray-500 mt-2">Click "Create Auction" to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {myAuctions.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyAuctionsPage
