// src/components/OctaneModel.tsx
import React, { Suspense } from 'react'; // Removed useRef as it wasn't used directly here
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei'; // Added Html for loader

// Simple Loader Component
function Loader() {
  return <Html center style={{ color: 'white' }}>Loading...</Html>;
}

// Component to load and display the GLB/GLTF model
function Model(props: any) {
  // Path confirmed to be likely correct by 304 status
  const { scene } = useGLTF('/octane.glb');
  // You might still need to adjust scale/position
  return <primitive object={scene} scale={1.0} {...props} />;
}

// Preload the model
useGLTF.preload('/octane.glb');

const OctaneModel: React.FC = () => {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<Loader />}> {/* Use the Loader component */}
          <Model />
          <Environment preset="sunset" background={false} />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
};

export default OctaneModel;