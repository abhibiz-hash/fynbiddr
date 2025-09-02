export interface Auction {
    id: string
    title: string
    description: string
    currentPrice: number
    startTime: string // ISO date string
    endTime: string // ISO date string
    imageUrl?: string
    seller: {
        firstName: string
        lastName?: string
    }
}