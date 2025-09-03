import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import apiClient from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import type { Auction, Bid } from '@/types'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const AuctionDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuth()
    const [auction, setAuction] = useState<Auction | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [bidAmount, setBidAmount] = useState('')
    const [bidError, setBidError] = useState('')
    const [socket, setSocket] = useState<Socket | null>(null)

    // Effect for fetching initial auction data (no change here)
    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const response = await apiClient.get(`/auctions/${id}`)
                setAuction(response.data)
                setBidAmount((response.data.currentPrice + 1).toString()) // Suggest next valid bid
            } catch (err) {
                setError('Failed to fetch auction details.')
            } finally {
                setLoading(false)
            }
        }
        fetchAuction()
    }, [id])

    // Effect for managing the single, persistent Socket.IO connection
    useEffect(() => {
        if (!id) return

        // Create the single socket connection
        const newSocket: Socket = io('http://localhost:3001', {
            withCredentials: true, // CRITICAL FIX: Send cookies with the connection
        })
        setSocket(newSocket); // Store it in state

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id)
            const token = localStorage.getItem('accessToken')
            if (token) {
                newSocket.emit('authenticate', token)
            }
            newSocket.emit('join_auction', id)
        })

        // Add an error listener for debugging
        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message)
            setError(`Failed to connect to the bidding server: ${err.message}. Please refresh.`)
        })


        newSocket.on('new_bid', (newBidData: { amount: number, userId: string, firstName: string }) => {
            setAuction((prevAuction) => {
                if (!prevAuction) return null
                const newBid: Bid = {
                    id: `temp-${Date.now()}`, // Temporary ID for React key
                    amount: newBidData.amount,
                    createdAt: new Date().toISOString(),
                    user: {
                        id: newBidData.userId,
                        firstName: newBidData.firstName,
                    },
                }
                // Add the new bid to the top of the list
                const updatedBids = [newBid, ...prevAuction.bids].slice(0, 10)
                return { ...prevAuction, currentPrice: newBidData.amount, bids: updatedBids }
            })
        })

        newSocket.on('outbid', () => alert("You've been outbid!"))
        newSocket.on('bid_error', (error: { message: string }) => setBidError(error.message))

        // Cleanup: disconnect when the component unmounts
        return () => {
            console.log('Disconnecting socket...')
            newSocket.emit('leave_auction', id)
            newSocket.disconnect()
        }
    }, [id]) // Re-run if auction ID changes

    // Corrected bid submission handler
    const handleBidSubmit = (e: React.FormEvent) => {
        console.log('Bid button clicked!')
        console.log('Socket state at time of click:', socket)
        e.preventDefault()
        setBidError('')
        const amount = parseFloat(bidAmount)

        if (isNaN(amount) || amount <= 0) {
            setBidError('Please enter a valid bid amount.')
            return
        }

        // Use the single, persistent socket from our state
        if (socket && socket.connected) {
            socket.emit('place_bid', { auctionId: id, amount })
        } else {
            setBidError('Connection to bidding server lost. Please refresh the page.')
        }
    }

    // --- JSX (no major changes, just a cleaner layout) ---
    if (loading) return <div className="text-center py-10">Loading Auction...</div>
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>
    if (!auction) return <div className="text-center py-10">Auction not found.</div>

    return (
        <div className="container mx-auto py-8">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <div className="bg-gray-200 aspect-square w-full rounded-lg flex items-center justify-center mb-4">
                        <span className="text-gray-500 text-xl">Image Placeholder</span>
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-2">{auction.title}</h1>
                    <p className="text-gray-600 mb-6">Sold by {auction.seller.firstName}</p>
                    <Card>
                        <CardHeader>
                            <CardTitle>Place Your Bid</CardTitle>
                            <CardDescription>Time Remaining: {/* Countdown logic here */}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">CURRENT BID</p>
                            <p className="text-5xl font-bold mb-6">₹{auction.currentPrice.toFixed(2)}</p>
                            {user ? (
                                <form onSubmit={handleBidSubmit} className="grid gap-4">
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder={`Enter bid > ₹${auction.currentPrice.toFixed(2)}`}
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            className="flex-grow"
                                        />
                                        <Button type="submit" size="lg">Place Bid</Button>
                                    </div>
                                    {bidError && <p className="text-red-500 text-sm">{bidError}</p>}
                                </form>
                            ) : (
                                <p className="text-center text-yellow-700 bg-yellow-100 p-3 rounded-md">Please log in to place a bid.</p>
                            )}
                        </CardContent>
                    </Card>
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{auction.description}</p>
                    </div>
                    {/* Bid History Section */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-2">Recent Bids</h3>
                        <Card>
                            <CardContent className="pt-6">
                                {auction.bids && auction.bids.length > 0 ? (
                                    <ul className="space-y-4">
                                        {auction.bids.map((bid) => (
                                            <li key={bid.id} className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{bid.user.firstName}</p>
                                                    <p className="text-xs text-gray-500">{new Date(bid.createdAt).toLocaleTimeString()}</p>
                                                </div>
                                                <p className="font-bold text-lg">₹{bid.amount.toFixed(2)}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-500">No bids yet. Be the first!</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuctionDetailPage