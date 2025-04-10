import React, { useState, useEffect, Suspense } from 'react';
import DecalCreator from '../components/DecalCreator';
import DecalService from '../services/decalService';
// --- Updated Import ---
import OctaneModel from '../components/OctaneModel'; // Import the component with its original name

const CreatePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decalId, setDecalId] = useState<string | null>(null);
  const [decalStatus, setDecalStatus] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Poll for decal status (Keep existing useEffect)
  useEffect(() => {
    if (!decalId || decalStatus === 'completed' || decalStatus === 'failed') {
      return;
    }
    const interval = setInterval(async () => {
      try {
        const status = await DecalService.checkDecalStatus(decalId);
        setDecalStatus(status);
        if (status === 'completed') {
          const url = await DecalService.downloadDecal(decalId);
          setDownloadUrl(url);
          clearInterval(interval);
        } else if (status === 'failed') {
          setError('Failed to generate decal. Please try again.');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error checking decal status:', err);
        setError('Error checking decal status');
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [decalId, decalStatus]);

  // Keep existing handleSubmit
  const handleSubmit = async (data: { prompt: string; colors: string[] }) => {
    try {
      setIsLoading(true);
      setError(null);
      setDecalId(null);
      setDecalStatus(null);
      setDownloadUrl(null);
      const result = await DecalService.generateDecal(data.prompt, data.colors);
      setDecalId(result.decalId);
      setDecalStatus(result.status);
      setIsLoading(false);
    } catch (err) {
      console.error('Error submitting decal:', err);
      setError('Error generating decal. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Decal</h1>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div> {/* Column 1: Decal Creator */}
          <DecalCreator onSubmit={handleSubmit} />
        </div>
        <div> {/* Column 2: 3D Viewer */}
          <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
          {/* --- Use Consistent Component Name --- */}
          <Suspense fallback={<div className="text-center p-4 h-96 flex items-center justify-center border border-gray-700 rounded-lg bg-gray-800 text-white">Loading 3D Model...</div>}>
            <OctaneModel /> {/* Use the imported name */}
          </Suspense>
          <p className="text-sm text-gray-400 mt-2 text-center">Use mouse to rotate/zoom.</p>
        </div>
      </div>

      {/* Keep existing Loading / Status / Download sections */}
      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Generating your decal...</p>
        </div>
      )}

      {decalStatus === 'processing' && !isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Processing your decal...</p>
        </div>
      )}

      {downloadUrl && (
        <div className="mt-8 text-center">
          <a
            href={downloadUrl}
            download
            className="btn btn-primary"
          >
            Download Your Decal
          </a>
          <p className="mt-2 text-sm text-gray-400">
            Extract the ZIP file and place the contents in your Bakkesmod/AlphaConsole decals folder.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatePage;