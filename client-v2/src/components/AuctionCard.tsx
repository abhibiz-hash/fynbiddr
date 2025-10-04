import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


const AuctionCard = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Auction Title Here</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Card content will go here</p>
            </CardContent>
            <CardFooter>
                <p>Card footer will go here</p>
            </CardFooter>
        </Card>
    )
}

export default AuctionCard
