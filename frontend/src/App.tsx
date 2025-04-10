import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Removed import './App.css' - assuming global styles are in index.css
// If App.css has necessary styles (like logo animation), keep the import.
// import './App.css';

// Import pages (Assuming these are .tsx/.ts files as well)
import Home from './pages/Home';
import CreatePage from './pages/CreatePage';
import GalleryPage from './pages/GalleryPage';
import DecalDetailPage from './pages/DecalDetailPage';

// Explicitly type the component FunctionComponent (FC) for good practice in TSX
import React, { FunctionComponent } from 'react';

const App: FunctionComponent = () => { // Added : FunctionComponent type
  return (
    <Router>
      {/* Apply dark background to the main container */}
      <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-gray-100">
        {/* Updated Header with dark theme and nav hover effect */}
        <header className="bg-gray-900 shadow-lg sticky top-0 z-50"> {/* Slightly darker header */}
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">WrapsRL</h1> {/* Increased size */}
            <nav>
              <ul className="flex space-x-6"> {/* Increased spacing */}
                {/* Updated Nav Links with better hover/active states */}
                <li><a href="/" className="text-gray-300 hover:text-white transition duration-200">Home</a></li>
                <li><a href="/create" className="text-gray-300 hover:text-white transition duration-200">Create</a></li>
                <li><a href="/gallery" className="text-gray-300 hover:text-white transition duration-200">Gallery</a></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Apply animation class if defined in App.css */}
        <main className="flex-grow container mx-auto px-6 py-8"> {/* Added padding */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/decals/:id" element={<DecalDetailPage />} />
          </Routes>
        </main>

        {/* Updated Footer with dark theme */}
        <footer className="bg-gray-900 py-6 mt-auto"> {/* Consistent darker footer */}
          <div className="container mx-auto px-6 text-center text-gray-500"> {/* Adjusted padding/color */}
            <p>© 2025 Rocket League Decal Generator | Powered by AI</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;