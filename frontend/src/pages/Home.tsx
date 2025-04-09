import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Rocket League Decal Generator</h1>
        <p className="text-xl mb-8">Create unique, AI-generated decals for your Octane in Rocket League</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Create New Decal</h2>
              <p className="mb-6">Design a custom decal using AI. Just describe what you want, choose your colors, and our AI will generate a unique decal for your Octane.</p>
              <Link to="/create" className="btn-primary block text-center">
                Start Creating
              </Link>
            </div>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Browse Gallery</h2>
              <p className="mb-6">Explore previously created decals. Get inspired by what others have made or check the status of your own creations.</p>
              <Link to="/gallery" className="btn-secondary block text-center">
                View Gallery
              </Link>
            </div>
          </div>
        </div>
        
        <div className="card mb-12">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center mb-3">1</div>
                <h3 className="text-xl font-bold mb-2">Describe Your Decal</h3>
                <p>Enter a detailed description of what you want your decal to look like and select your color scheme.</p>
              </div>
              
              <div>
                <div className="bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center mb-3">2</div>
                <h3 className="text-xl font-bold mb-2">AI Generation</h3>
                <p>Our AI will process your description and generate a unique decal texture tailored to your specifications.</p>
              </div>
              
              <div>
                <div className="bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center mb-3">3</div>
                <h3 className="text-xl font-bold mb-2">Download & Install</h3>
                <p>Preview your decal in 3D, then download the package and install it in your Bakkesmod/AlphaConsole folder.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            <p className="mb-4">
              This Rocket League Decal Generator uses advanced AI to create custom decals for the Octane vehicle.
              The current version focuses exclusively on the Octane, with plans to expand to other vehicles in the future.
            </p>
            <p>
              All decals are compatible with Bakkesmod and AlphaConsole, allowing you to use them in-game without affecting other players.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
