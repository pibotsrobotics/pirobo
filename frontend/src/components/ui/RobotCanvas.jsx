import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Sparkles, ScrollControls, Environment } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'motion/react';
import * as THREE from 'three';
import FlyingRobot from './FlyingRobot';

function CyberCore({ scrollOffset }) {
  const coreRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const offset = scrollOffset?.get() || 0;

    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.5 + offset * Math.PI * 4;
      coreRef.current.rotation.x = time * 0.2 + offset * Math.PI * 2;
      coreRef.current.scale.setScalar(1 + offset * 0.5); // Core grows slightly as you scroll
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = Math.sin(time * 0.5) * Math.PI + offset * Math.PI * 2;
      ringRef1.current.rotation.y = time * 0.8;
      // Rings expand outwards as you scroll down
      const ring1Scale = 1 + offset * 2;
      ringRef1.current.scale.set(ring1Scale, ring1Scale, ring1Scale);
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = Math.cos(time * 0.3) * Math.PI;
      ringRef2.current.rotation.z = time * 0.6 + offset * Math.PI * 2;
      const ring2Scale = 1 + offset * 1.5;
      ringRef2.current.scale.set(ring2Scale, ring2Scale, ring2Scale);
    }
    
    // Group moves down as the user scrolls, keeping it somewhat centered across tall pages
    if(groupRef.current){
        // ScrollOffset goes 0 -> 1. We move the Y position negative so it appears to go down.
        // Tweak the multiplier (-10) based on the height of the Home page
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, offset * -10, 0.1);
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, Math.sin(offset * Math.PI) * 4, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Inner Glowing Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial 
            color="#F97316" 
            emissive="#F97316" 
            emissiveIntensity={2} 
            wireframe 
          />
        </mesh>

        <mesh scale={1.4}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
        </mesh>

        {/* Orbiting Rings */}
        <mesh ref={ringRef1}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#EA580C" />
        </mesh>

        <mesh ref={ringRef2} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
      </Float>

      {/* Floating Particles bound to the core */}
      <Sparkles count={150} scale={15} size={3} speed={0.4} color="#F97316" />
      <Sparkles count={100} scale={12} size={2} speed={0.2} color="#ffffff" />
    </group>
  );
}

// Background abstract geometry elements floating around
function FloatingElements({ scrollOffset }) {
    const groupRef = useRef();
  
    useFrame((state) => {
      const time = state.clock.getElapsedTime();
      const offset = scrollOffset?.get() || 0;
      
      if(groupRef.current) {
          groupRef.current.rotation.y = time * 0.1;
          groupRef.current.position.y = offset * 5; // move opposite to the core
      }
    });
  
    return (
      <group ref={groupRef}>
        {[...Array(10)].map((_, i) => (
          <Float key={i} speed={1} rotationIntensity={2} floatIntensity={5}
             position={[
                (Math.random() - 0.5) * 30, 
                (Math.random() - 0.5) * 40 - 10, 
                (Math.random() - 0.5) * 20 - 10
             ]}>
            <mesh scale={Math.random() * 0.5 + 0.1} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#374151" wireframe transparent opacity={0.3} />
            </mesh>
          </Float>
        ))}
      </group>
    );
}

// Massive robotic structure in the background
function CyberGiant({ scrollOffset }) {
    const groupRef = useRef();
    const headRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const offset = scrollOffset?.get() || 0;
        
        if (groupRef.current) {
            // Subtle rotation and vertical movement opposite to scroll
            groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
            groupRef.current.position.z = -15 - offset * 10;
            groupRef.current.position.y = -2 + offset * 8;
        }
        if (headRef.current) {
            headRef.current.rotation.y = time * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={[0, -2, -15]}>
            {/* Massive Abstract Head */}
            <mesh ref={headRef} scale={8}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial 
                    color="#1e293b" 
                    emissive="#F97316" 
                    emissiveIntensity={0.05} 
                    wireframe 
                    transparent 
                    opacity={0.15} 
                />
            </mesh>

            {/* Glowing Eye/Lens */}
            <mesh position={[0, 2, 6]} scale={[2, 0.5, 0.5]}>
                <boxGeometry />
                <meshStandardMaterial 
                    color="#F97316" 
                    emissive="#F97316" 
                    emissiveIntensity={2} 
                    transparent 
                    opacity={0.6} 
                />
            </mesh>

            {/* Structural "Shoulders" or Frame */}
            <mesh position={[0, -6, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.2, 20, 32]} />
                <meshStandardMaterial color="#334155" wireframe transparent opacity={0.2} />
            </mesh>
            
            <mesh position={[-8, -8, 0]} rotation={[Math.PI / 4, 0, 0]}>
                <boxGeometry args={[1, 15, 1]} />
                <meshStandardMaterial color="#1e293b" wireframe transparent opacity={0.1} />
            </mesh>

            <mesh position={[8, -8, 0]} rotation={[Math.PI / 4, 0, 0]}>
                <boxGeometry args={[1, 15, 1]} />
                <meshStandardMaterial color="#1e293b" wireframe transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

const Scene = () => {
    const { scrollYProgress } = useScroll();

    return (
        <>
            {/* Lights */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#F97316" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4F46E5" />

            {/* Space Background */}
            <Stars radius={150} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />

            {/* Main 3D Objects */}
            <CyberCore scrollOffset={scrollYProgress} />
            <FloatingElements scrollOffset={scrollYProgress} />
            <CyberGiant scrollOffset={scrollYProgress} />
            
            {/* User Requested Flying Robot */}
            <FlyingRobot scrollOffset={scrollYProgress} />
        </>
    );
};

const RobotCanvas = () => {
  return (
    <div className="fixed inset-0 z-[-1] h-screen w-full opacity-60 pointer-events-none transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Scene />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default RobotCanvas;
