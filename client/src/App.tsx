import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from './components/Layout'
import Homepage from "./pages/Homepage"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
