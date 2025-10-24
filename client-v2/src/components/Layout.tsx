import { Outlet, } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from "@/components/ui/sonner"
import SearchBar from './SearchBar'


const Layout = () => {

    return (
        <div className="relative isolate">
            <div className='overflow-x-hidden'>
                <div className="radial-gradient-blob "></div>
            </div>

            <div className='min-h-screen flex flex-col'>
                <header className='sticky top-0 z-50 w-full'>
                    <div className='container mx-auto py-3 px-6 flex justify-center items-center gap-4'>
                        <Navbar />
                        <SearchBar />
                    </div>
                </header>

                <main className="flex-grow">
                    {/* Page content will be rendered here */}
                    <Outlet />
                </main>

                <Footer />
                <Toaster
                    position="top-right"
                    richColors
                    toastOptions={{
                        style: {
                            background: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(229, 231, 235, 0.8)',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
                            borderRadius: '0.5rem',
                        } as React.CSSProperties,
                    }}
                />
            </div>

        </div>
    )
}

export default Layout
