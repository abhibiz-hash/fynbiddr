import { useState, useEffect } from "react"
import apiClient from "../api/axios"
import type { Auction } from "@/types"


const AllAuctionsPage = () => {

    const [auctions, setAuctions] = useState<Auction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    
    const [searchTerm, setSearchTerm] = useState('')
    const [status, setStatus] = useState('ACTIVE')
    const [sortBy, setSortBy] = useState('endTime-asc')

    return (
        <div className="mx-auto container py-15">
            <h1>All Auctions</h1>
            <p>Browse, search and find your next treasure</p>
        </div>
    )
}

export default AllAuctionsPage
