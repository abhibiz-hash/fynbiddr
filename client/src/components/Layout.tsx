import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">FynBiddr</h1>
                </nav>
            </header>

            <main className="flex-grow container mx-auto p-6">
                <Outlet />
            </main>

            <footer className="bg-white">
                <div className="container mx-auto px-6 py-4">
                    <p className="text-center text-gray-600">
                        &copy; 2025 BidZone. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Layout
