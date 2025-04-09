import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import OctaneModel from './OctaneModel';
import ColorPicker from './ColorPicker';

interface DecalCreatorProps {
  onSubmit: (data: { prompt: string; colors: string[] }) => void;
}

const DecalCreator: React.FC<DecalCreatorProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [colors, setColors] = useState<string[]>(['#FF0000', '#000000', '#FFFFFF']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewTexture, setPreviewTexture] = useState<string | null>(null);

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length < 5) {
      setColors([...colors, '#FFFFFF']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const newColors = [...colors];
      newColors.splice(index, 1);
      setColors(newColors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // In a real implementation, this would call the API and update the preview
    onSubmit({ prompt, colors });
    
    // Simulate a response for now
    setTimeout(() => {
      setIsGenerating(false);
      // This would be the URL of the generated texture
      setPreviewTexture('placeholder-texture.png');
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Create Your Decal</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
              Describe your decal
            </label>
            <textarea
              id="prompt"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              rows={4}
              placeholder="e.g., flaming cybernetic wolf with neon accents"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Choose your colors (max 5)
            </label>
            <div className="space-y-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ColorPicker
                    color={color}
                    onChange={(newColor) => handleColorChange(index, newColor)}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-500 hover:text-red-400"
                    disabled={colors.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {colors.length < 5 && (
                <button
                  type="button"
                  onClick={addColor}
                  className="text-blue-500 hover:text-blue-400"
                >
                  + Add another color
                </button>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate Decal'}
          </button>
        </form>
      </div>
      
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <OctaneModel textureUrl={previewTexture} colors={colors} />
            <OrbitControls />
          </Canvas>
        </div>
        
        {previewTexture && (
          <div className="mt-4 text-center">
            <button className="btn-primary">
              Download Decal Package
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecalCreator;
