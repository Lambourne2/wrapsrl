import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import pages
import Home from './pages/Home';
import CreatePage from './pages/CreatePage';
import GalleryPage from './pages/GalleryPage';
import DecalDetailPage from './pages/DecalDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">WrapsRL</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="hover:text-blue-400">Home</a></li>
                <li><a href="/create" className="hover:text-blue-400">Create</a></li>
                <li><a href="/gallery" className="hover:text-blue-400">Gallery</a></li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/decals/:id" element={<DecalDetailPage />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 mt-auto py-6">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© 2025 Rocket League Decal Generator | Powered by AI</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
