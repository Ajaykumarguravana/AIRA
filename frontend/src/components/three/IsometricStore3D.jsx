import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text, Html } from '@react-three/drei'
import { storeHealthDepartments } from '../../utils/demoData'
import { ShoppingCart, AlertTriangle, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react'

// 3D Shelf Department Node Component
function StoreShelfNode({ position, name, status, color, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + (hovered ? 0.15 : Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.05)
    }
  })

  return (
    <group position={position}>
      {/* Base Shelf Box */}
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <boxGeometry args={[1.8, 0.45, 1.4]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 0.6 : 0.25} 
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Product Box Stacks on Top */}
      <mesh position={[-0.4, 0.45, -0.2]}>
        <boxGeometry args={[0.4, 0.35, 0.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>
      <mesh position={[0.4, 0.45, 0.2]}>
        <boxGeometry args={[0.4, 0.35, 0.4]} />
        <meshStandardMaterial color="#4f8cff" roughness={0.1} />
      </mesh>

      {/* Floating 3D Department Label */}
      <Html position={[0, 1.1, 0]} center distanceFactor={10}>
        <div className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap border backdrop-blur-md transition-all ${
          hovered ? 'scale-110 shadow-lg' : ''
        }`} style={{ backgroundColor: '#07111f', borderColor: color, color: '#f8fafc' }}>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span>{name}</span>
          </span>
        </div>
      </Html>
    </group>
  )
}

// 3D AI Assistant Robot Float
function AIRobotModel() {
  const botRef = useRef()

  useFrame((state) => {
    if (botRef.current) {
      botRef.current.position.y = 0.5 + Math.sin(state.clock.getElapsedTime() * 1.8) * 0.15
      botRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={botRef} position={[3.2, 0.5, 2]}>
      {/* Bot Head */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#07111f" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Visor Cyan Glow */}
      <mesh position={[0, 0.65, 0.28]}>
        <boxGeometry args={[0.35, 0.12, 0.1]} />
        <meshStandardMaterial color="#00d9ff" emissive="#00d9ff" emissiveIntensity={2} />
      </mesh>
      {/* Bot Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.7, 32]} />
        <meshStandardMaterial color="#4f8cff" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Outer Halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.02, 16, 64]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

export default function IsometricStore3D({ onSelectDepartment, interactive = true }) {
  const departmentPositions = [
    { pos: [-2.4, 0, -1.8], data: storeHealthDepartments[0] }, // Beverages
    { pos: [0, 0, -1.8], data: storeHealthDepartments[1] },    // Grocery
    { pos: [2.4, 0, -1.8], data: storeHealthDepartments[4] },    // Electronics
    { pos: [-2.4, 0, 1.2], data: storeHealthDepartments[2] },   // Snacks
    { pos: [0, 0, 1.2], data: storeHealthDepartments[3] },    // Personal Care
  ]

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      <Canvas camera={{ position: [7, 6, 8], fov: 42 }}>
        <ambientLight intensity={1.1} />
        <pointLight position={[10, 12, 10]} intensity={2.5} color="#00d9ff" />
        <pointLight position={[-10, -8, -10]} intensity={1.8} color="#7c3aed" />

        {/* Isometric Ground Store Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
          <planeGeometry args={[12, 10]} />
          <meshStandardMaterial color="#0d1b2a" roughness={0.4} metalness={0.3} />
        </mesh>
        
        {/* Floor Grid Lines */}
        <gridHelper args={[12, 12, "#00d9ff", "#111e2e"]} position={[0, -0.19, 0]} />

        {/* Outer Store Glass Wall Outline */}
        <mesh position={[0, 0.8, -5.1]}>
          <boxGeometry args={[12, 2, 0.1]} />
          <meshStandardMaterial color="#4f8cff" opacity={0.15} transparent wireframe />
        </mesh>

        {/* Render Shelves */}
        {departmentPositions.map((item, idx) => (
          <StoreShelfNode
            key={idx}
            position={item.pos}
            name={item.data.name}
            status={item.data.status}
            color={item.data.color}
            onClick={() => onSelectDepartment && onSelectDepartment(item.data)}
          />
        ))}

        {/* AI Robot Manager Helper */}
        <AIRobotModel />

        {interactive && (
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.8} 
            maxPolarAngle={Math.PI / 2.2} 
            minPolarAngle={Math.PI / 4}
          />
        )}
      </Canvas>
    </div>
  )
}
