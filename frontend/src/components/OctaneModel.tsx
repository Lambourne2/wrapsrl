import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface OctaneModelProps {
  textureUrl: string | null;
  colors: string[];
}

const OctaneModel: React.FC<OctaneModelProps> = ({ textureUrl, colors }) => {
  const group = useRef<THREE.Group>(null);
  
  // In a real implementation, we would load an actual Octane model
  // For now, we'll use a simple car-like shape as a placeholder
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  // Create a material with the primary color
  const primaryColor = colors[0] || '#FF0000';
  const secondaryColor = colors[1] || '#000000';
  
  // Create a texture if a URL is provided
  const texture = textureUrl ? useTexture(textureUrl) : null;
  
  // Create materials
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(primaryColor),
    roughness: 0.3,
    metalness: 0.8,
  });
  
  const detailMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(secondaryColor),
    roughness: 0.5,
    metalness: 0.5,
  });
  
  // If we have a texture, apply it to the body material
  if (texture) {
    bodyMaterial.map = texture;
  }

  return (
    <group ref={group}>
      {/* This is a simplified car shape for demonstration */}
      <mesh position={[0, 0, 0]} material={bodyMaterial}>
        <boxGeometry args={[2, 0.5, 4]} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[-1, -0.5, 1.3]} material={detailMaterial}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh position={[1, -0.5, 1.3]} material={detailMaterial}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh position={[-1, -0.5, -1.3]} material={detailMaterial}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      <mesh position={[1, -0.5, -1.3]} material={detailMaterial}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.5, 0.5]} rotation={[Math.PI / 6, 0, 0]} material={detailMaterial}>
        <boxGeometry args={[1.8, 0.1, 1.5]} />
      </mesh>
    </group>
  );
};

export default OctaneModel;
