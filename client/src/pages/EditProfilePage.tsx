import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EditProfilePage = () => {
  const { user } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // Pre-fill the form with the user's current data
  useEffect(() => {
    const fetchCurrentData = async () => {
        try {
            // We use /api/profile which gets the logged-in user's info
            const response = await apiClient.get('/profile')
            setFirstName(response.data.firstName || '')
            setLastName(response.data.lastName || '')
        } catch (err) {
            setError("Could not fetch your profile data.")
        }
    }
    fetchCurrentData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      // The backend uses the token to identify the user, so we send to '/me'
      await apiClient.put('/users/me', { firstName, lastName })
      
      // We need to generate a new token because the old one might contain the old name.
      // A better long-term solution is for the backend to send a new token on update.
      // For now, we'll just show a success message.
      setSuccess('Profile updated successfully!')

      // Optionally, navigate back to the profile page after a delay
      setTimeout(() => {
        if(user) navigate(`/users/${user.userId}`)
      }, 1500)

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    }
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Your Profile</CardTitle>
          <CardDescription>Update your public information here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProfilePage