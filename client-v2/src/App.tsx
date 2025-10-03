import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

function HomePagePlaceholder() {
  return <div className="p-8"><h1>Homepage Content</h1></div>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePagePlaceholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App