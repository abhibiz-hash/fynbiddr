import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from './components/Layout'
import Homepage from "./pages/Homepage"
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuctionDetailPage from './pages/AuctionDetailPage'


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
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
