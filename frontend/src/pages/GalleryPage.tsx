import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DecalService from '../services/decalService';

interface Decal {
  _id: string;
  name: string;
  prompt: string;
  colors: string[];
  status: string;
  previewUrl?: string;
  createdAt: string;
}

const GalleryPage: React.FC = () => {
  const [decals, setDecals] = useState<Decal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDecals = async () => {
      try {
        setIsLoading(true);
        const fetchedDecals = await DecalService.getDecals();
        setDecals(fetchedDecals);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching decals:', err);
        setError('Failed to load decals. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDecals();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Decal Gallery</h1>
        <Link to="/create" className="btn-primary">
          Create New Decal
        </Link>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading decals...</p>
        </div>
      ) : decals.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <h2 className="text-xl mb-4">No decals found</h2>
          <p className="mb-6">Create your first decal to get started!</p>
          <Link to="/create" className="btn-primary">
            Create New Decal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decals.map((decal) => (
            <div key={decal._id} className="card hover:shadow-xl transition-shadow">
              <div className="bg-gray-700 h-48 rounded-t-lg flex items-center justify-center">
                {decal.previewUrl ? (
                  <img 
                    src={decal.previewUrl} 
                    alt={decal.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 mx-auto mb-2 flex">
                      {decal.colors.map((color, index) => (
                        <div 
                          key={index}
                          className="w-full h-full rounded-full border border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-gray-400 italic">Preview not available</p>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{decal.name}</h3>
                <p className="text-gray-400 mb-2 text-sm truncate">{decal.prompt}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    decal.status === 'completed' ? 'bg-green-800 text-green-200' :
                    decal.status === 'processing' ? 'bg-blue-800 text-blue-200' :
                    decal.status === 'failed' ? 'bg-red-800 text-red-200' :
                    'bg-gray-800 text-gray-200'
                  }`}>
                    {decal.status.charAt(0).toUpperCase() + decal.status.slice(1)}
                  </span>
                  
                  <Link to={`/decals/${decal._id}`} className="text-blue-400 hover:text-blue-300">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
