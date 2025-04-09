import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DecalService from '../services/decalService';
import OctaneModel from '../components/OctaneModel';

interface DecalDetail {
  _id: string;
  name: string;
  prompt: string;
  colors: string[];
  status: string;
  imageUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const DecalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [decal, setDecal] = useState<DecalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchDecal = async () => {
      try {
        if (!id) return;
        
        setIsLoading(true);
        const fetchedDecal = await DecalService.getDecalById(id);
        setDecal(fetchedDecal);
        setIsLoading(false);
        
        // If the decal is still processing, set up polling
        if (fetchedDecal.status === 'processing') {
          const interval = setInterval(async () => {
            try {
              const updatedDecal = await DecalService.getDecalById(id);
              setDecal(updatedDecal);
              
              if (updatedDecal.status !== 'processing') {
                clearInterval(interval);
                setPollingInterval(null);
              }
            } catch (err) {
              console.error('Error polling decal status:', err);
              clearInterval(interval);
              setPollingInterval(null);
            }
          }, 5000); // Poll every 5 seconds
          
          setPollingInterval(interval);
        }
      } catch (err) {
        console.error('Error fetching decal:', err);
        setError('Failed to load decal details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDecal();
    
    // Clean up polling interval on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [id]);

  const handleDownload = async () => {
    try {
      if (!decal) return;
      
      const downloadUrl = await DecalService.downloadDecal(decal._id);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${decal.name.replace(/\s+/g, '_')}_decal.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading decal:', err);
      setError('Failed to download decal. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Loading decal details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500 text-white p-4 rounded-md">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/gallery" className="text-blue-400 hover:text-blue-300">
            &larr; Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  if (!decal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-500 text-white p-4 rounded-md">
          Decal not found.
        </div>
        <div className="mt-4">
          <Link to="/gallery" className="text-blue-400 hover:text-blue-300">
            &larr; Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/gallery" className="text-blue-400 hover:text-blue-300">
          &larr; Back to Gallery
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-4">{decal.name}</h1>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Prompt</h2>
            <p className="bg-gray-700 p-3 rounded">{decal.prompt}</p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Colors</h2>
            <div className="flex space-x-2">
              {decal.colors.map((color, index) => (
                <div 
                  key={index}
                  className="w-8 h-8 rounded-full border border-gray-600"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Status</h2>
            <span className={`px-3 py-1 rounded-full ${
              decal.status === 'completed' ? 'bg-green-800 text-green-200' :
              decal.status === 'processing' ? 'bg-blue-800 text-blue-200' :
              decal.status === 'failed' ? 'bg-red-800 text-red-200' :
              'bg-gray-800 text-gray-200'
            }`}>
              {decal.status.charAt(0).toUpperCase() + decal.status.slice(1)}
            </span>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Created</h2>
            <p>{new Date(decal.createdAt).toLocaleString()}</p>
          </div>
          
          {decal.status === 'completed' && (
            <button 
              onClick={handleDownload}
              className="btn-primary w-full"
            >
              Download Decal Package
            </button>
          )}
          
          {decal.status === 'processing' && (
            <div className="text-center py-3 bg-blue-900 bg-opacity-30 rounded">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
              <span>Processing your decal...</span>
            </div>
          )}
          
          {decal.status === 'failed' && (
            <div className="text-center py-3 bg-red-900 bg-opacity-30 rounded">
              <p>Generation failed. Please try again with a different prompt.</p>
            </div>
          )}
        </div>
        
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <OctaneModel textureUrl={decal.imageUrl || null} colors={decal.colors} />
              <OrbitControls />
            </Canvas>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Installation Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 bg-gray-800 p-4 rounded">
              <li>Download the decal package using the button above</li>
              <li>Extract the ZIP file to a temporary location</li>
              <li>Copy all extracted files to your Bakkesmod/AlphaConsole decals folder</li>
              <li>Launch Rocket League and select the decal in Bakkesmod/AlphaConsole</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecalDetailPage;
