import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiClient from '../api/axios'
import type { UserProfile } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'

const ProfilePage = () => {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuth(); // Get the currently logged-in user
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/users/${id}`)
                setProfile(response.data)
            } catch (err) {
                setError('Failed to load user profile.')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchProfile()
        }
    }, [id])

    if (loading) return <div className="text-center py-10">Loading profile...</div>
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>
    if (!profile) return <div className="text-center py-10">User not found.</div>

    const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })


    return (
        <div className="container mx-auto py-12">
            <div className="flex flex-col items-center mb-8 relative">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-3xl text-gray-600">{profile.firstName.charAt(0)}</span>
                </div>
                <h1 className="text-4xl font-bold">{profile.firstName} {profile.lastName}</h1>
                <p className="text-gray-600 mt-2">Joined on {joinDate}</p>
                {/* Show Edit button only if this is the logged-in user's profile */}
                {user?.userId === profile.id && (
                    <Button asChild variant="outline" className="absolute top-0 right-0">
                        <Link to="/profile/edit">Edit Profile</Link>
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{profile.firstName}'s Live Auctions</CardTitle>
                </CardHeader>
                <CardContent>
                    {profile.auctions.length > 0 ? (
                        <div className="space-y-4">
                            {profile.auctions.map(auction => (
                                <div key={auction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div>
                                        <p className="font-semibold">{auction.title}</p>
                                        <p className="text-sm text-gray-500">Current Bid: ₹{auction.currentPrice.toFixed(2)}</p>
                                    </div>
                                    <Button asChild variant="secondary" size="sm">
                                        <Link to={`/auctions/${auction.id}`}>View Auction</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">This user has no active auctions.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ProfilePage