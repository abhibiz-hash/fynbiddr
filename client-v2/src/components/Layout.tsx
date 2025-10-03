import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'


const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className='sticky top-4 z-50 flex justify-center w-full'>
                <Navbar />
            </header>

            <main className="flex-grow">
                {/* Page content will be rendered here */}
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default Layout
