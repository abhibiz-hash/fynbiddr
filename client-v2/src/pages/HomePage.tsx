import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'


const HomePage = () => {
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
            {/* Our "Newly Listed" section will go here */}
        </div>
    )
}

export default HomePage