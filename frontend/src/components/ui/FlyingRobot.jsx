import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Trail, Sphere, Cylinder, Box, useScroll } from '@react-three/drei';
import * as THREE from 'three';

const FlyingRobot = ({ scrollOffset }) => {
    const groupRef = useRef();
    
    // Core colors
    const primaryColor = "#f97316"; // Bright Orange
    const bodyColor = "#374151";    // Lighter Gray for visibility

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Get scroll offset (0 to 1) from props
        const offset = scrollOffset?.get() || 0;

        // BOLDER PATH: Stay closer to camera (which is at z=8)
        // Start further back but come MUCH closer
        const targetZ = -2 + (offset * 12); // From -2 to 10 (passes camera)
        const targetY = 1 - (offset * 3);    // Center to lower
        const targetX = Math.cos(state.clock.elapsedTime * 0.5) * 5 + Math.sin(offset * Math.PI) * 10;

        // Much faster interpolation for responsive feel
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);

        // Dynamic banking
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -Math.sin(state.clock.elapsedTime) * 0.5, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.4, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.sin(state.clock.elapsedTime * 0.5) * 0.5, 0.1);
    });

    return (
        <group ref={groupRef} position={[5, 1, -2]}>
            <Float
                speed={5} 
                rotationIntensity={1} 
                floatIntensity={3}
                floatingRange={[-0.5, 0.5]}
            >
                {/* LARGER Robot Body */}
                <Box args={[1.5, 0.8, 2]} radius={0.2}>
                    <meshStandardMaterial color={bodyColor} roughness={0.1} metalness={0.9} emissive="#000000" />
                </Box>
                
                {/* Robot Eye/Core - Brighter */}
                <Sphere args={[0.3, 32, 32]} position={[0, 0.2, 1]}>
                    <meshBasicMaterial color={primaryColor} toneMapped={false} />
                    <pointLight color={primaryColor} intensity={5} distance={10} />
                </Sphere>

                {/* Left Thruster Engine */}
                <group position={[-1, 0, -0.8]}>
                    <Cylinder args={[0.2, 0.3, 0.8, 16]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={1} />
                    </Cylinder>
                    <pointLight position={[0, 0, -0.5]} color={primaryColor} intensity={2} distance={3} />
                    {/* Simplified Trail/Glow */}
                    <Sphere args={[0.1]} position={[0, 0, -0.6]}>
                        <meshBasicMaterial color={primaryColor} />
                    </Sphere>
                </group>

                {/* Right Thruster Engine */}
                <group position={[1, 0, -0.8]}>
                    <Cylinder args={[0.2, 0.3, 0.8, 16]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={1} />
                    </Cylinder>
                    <pointLight position={[0, 0, -0.5]} color={primaryColor} intensity={2} distance={3} />
                    <Sphere args={[0.1]} position={[0, 0, -0.6]}>
                        <meshBasicMaterial color={primaryColor} />
                    </Sphere>
                </group>

                {/* Floating Ring around body - More Visible */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2, 0.05, 16, 100]} />
                    <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={2} toneMapped={false} transparent opacity={0.6} />
                </mesh>
            </Float>
        </group>
    );
};

export default FlyingRobot;
