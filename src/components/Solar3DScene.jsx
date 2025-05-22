import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

function SunWithParticles() {
  const sunRef = useRef();
  const particlesRef = useRef();
  const hour = new Date().getHours();
  
  // Intensidad solar basada en la hora (0.3 a 1.0)
  const solarIntensity = 0.3 + 0.7 * (1 - Math.abs(12 - hour) / 12);

  // Partículas para rayos solares
  const particlesCount = 300;
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const radius = 2 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    sunRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <group>
      {/* Sol principal */}
      <mesh ref={sunRef} position={[-4, 2, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color="#FDB813" 
          emissive="#FDB813"
          emissiveIntensity={solarIntensity * 0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Rayos de sol (partículas) */}
      <points ref={particlesRef} position={[-4, 2, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.1} 
          color={new THREE.Color(1, 0.8, 0.2)} 
          transparent 
          opacity={solarIntensity}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Etiqueta flotante */}
      <Text
        position={[-4, 4, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {`Intensidad: ${Math.round(solarIntensity * 100)}%`}
      </Text>
    </group>
  );
}


export function Solar3DScene() {
  return (
    <div style={{ 
      height: '400px', 
      width: '100%', 
      marginTop: '2rem',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    }}>
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#111133']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <SunWithParticles />

        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} />
      </Canvas>
    </div>
  );
}