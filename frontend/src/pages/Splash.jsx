import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Stars, Text, MeshWobbleMaterial, useTexture } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Zap, Activity } from 'lucide-react'

// 3D Floating Logo Badge Component
function LogoBadge() {
  const meshRef = useRef()
  const logoTexture = useTexture('/logo.png')

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.15
    }
  })

  return (
    <group ref={meshRef}>
      {/* Outer Glowing Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.04, 16, 100]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} wireframe />
      </mesh>
      
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} />
      </mesh>

      {/* Central Double-Sided Textured Plaque */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.15, 64]} />
        <meshStandardMaterial 
          map={logoTexture} 
          roughness={0.2} 
          metalness={0.8}
          emissive="#003344"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Cyber Back Ring */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 0.12, 64]} />
        <meshStandardMaterial color="#040914" roughness={0.1} metalness={0.9} wireframe />
      </mesh>
    </group>
  )
}

export default function Splash() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const handleEnter = () => {
    navigate('/landing')
  }

  return (
    <div className="relative w-screen h-screen bg-[#040914] text-white overflow-hidden select-none font-sans">
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
          <pointLight position={[-10, -10, -10]} intensity={1.5} color="#a855f7" />
          
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1.5} />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
            <LogoBadge />
          </Float>

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
        </Canvas>
      </div>

      {/* Header Overlay */}
      <div className="absolute top-8 left-8 right-8 z-10 flex justify-between items-center px-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <img src="/logo.png" alt="AIRA Logo" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-cyan-400">AIRA</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">AI Retail Intelligence</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-6 text-xs text-cyan-300/70 border border-cyan-500/20 px-4 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>NEURAL CORE ONLINE</span>
          </span>
          <span className="text-gray-600">|</span>
          <span>SYSTEM v2.5 HYPER-DRIVE</span>
        </div>
      </div>

      {/* Bottom Content / Controls */}
      <div className="absolute bottom-12 inset-x-0 z-10 flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-xl mb-6"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEXT-GEN AI FOR RETAIL ANALYTICS</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            INTELLIGENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">COMMAND CENTER</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-md mx-auto">
            Real-time node cluster mapping, predictive inventory neural nets, and automated store optimization.
          </p>
        </motion.div>

        {/* Loading Progress Bar & Launch Button */}
        <div className="w-full max-w-md space-y-4">
          {progress < 100 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-cyan-400/80 font-mono">
                <span>INITIALIZING NEURAL NETS...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500 transition-all duration-100 ease-out shadow-[0_0_10px_#00f0ff]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <motion.button
              onClick={handleEnter}
              whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(0,240,255,0.6)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-slate-950 font-bold tracking-wider text-sm flex items-center justify-center space-x-3 shadow-lg shadow-cyan-500/30 transition-all"
            >
              <span>EXPLORE AIRA PLATFORM</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}

          <div className="flex justify-center items-center space-x-6 text-[11px] text-gray-500 pt-2">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise Grade</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Graphing</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Predictive AI</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
