export interface Auction {
    id: string
    title: string
    description: string
    currentPrice: number
    startTime: string // ISO date string
    endTime: string // ISO date string
    imageUrl?: string
    seller: {
        id:string
        firstName: string
        lastName?: string
    }
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName?: string;
    createdAt: string; // ISO date string
    auctions: Pick<Auction, 'id' | 'title' | 'currentPrice' | 'endTime'>[];
}