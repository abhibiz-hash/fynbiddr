import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from './components/Layout'
import Homepage from "./pages/Homepage"
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuctionDetailPage from './pages/AuctionDetailPage'
import CreateAuctionPage from './pages/CreateAuctionPage'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="auctions/:id" element={<AuctionDetailPage />} />
            {/* Protected Route for Sellers */}
            <Route element={<ProtectedRoute allowedRoles={['SELLER']} />}>
              <Route path="auctions/new" element={<CreateAuctionPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
