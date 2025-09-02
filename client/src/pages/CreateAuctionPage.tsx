import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiClient from "@/api/axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'


const CreateAuctionPage = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [startingPrice, setStartingPrice] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            const response = await apiClient.post('/auctions', {
                title,
                description,
                startingPrice: parseFloat(startingPrice),
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
            })
            // Navigate to the newly created auction's detail page
            navigate(`/auctions/${response.data.id}`)

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create auction. Please check your inputs.')
            console.log(err)
        }
    }
    return (
        <div className="container mx-auto py-12">
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Create a New Auction</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g., Vintage Mechanical Keyboard" required value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Describe your item in detail..." required value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="startingPrice">Starting Price (₹)</Label>
                            <Input id="startingPrice" type="number" step="0.01" placeholder="e.g., 5000.00" required value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input id="startTime" type="datetime-local" required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input id="endTime" type="datetime-local" required value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">Create Auction</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateAuctionPage
