import React, { useRef, useEffect, useState } from 'react'

const initialNodes = [
  { id: 'hub', label: 'SUPERMART HUB', type: 'hub', status: 'healthy', x: 450, y: 300, radius: 36, color: '#00f0ff', details: { category: 'Central Command', stock: 1250, velocity: 'Optimal' } },
  
  // Categories
  { id: 'cat-grocery', label: 'GROCERY CLUSTER', type: 'category', status: 'warning', x: 260, y: 160, radius: 24, color: '#a855f7', parent: 'hub' },
  { id: 'cat-dairy', label: 'DAIRY & FRESH', type: 'category', status: 'healthy', x: 640, y: 160, radius: 24, color: '#a855f7', parent: 'hub' },
  { id: 'cat-snacks', label: 'SNACKS & BEV', type: 'category', status: 'healthy', x: 240, y: 440, radius: 24, color: '#a855f7', parent: 'hub' },
  { id: 'cat-personal', label: 'PERSONAL & HOUSE', type: 'category', status: 'critical', x: 660, y: 440, radius: 24, color: '#a855f7', parent: 'hub' },

  // Products
  { id: 'p1', label: 'Fortune Sunflower Oil', type: 'product', status: 'critical', stock: 4, minStock: 10, price: 145, velocity: 'Medium', x: 120, y: 110, radius: 16, color: '#f43f5e', parent: 'cat-grocery' },
  { id: 'p2', label: 'Basmati Rice 5kg', type: 'product', status: 'healthy', stock: 22, minStock: 10, price: 495, velocity: 'Medium', x: 200, y: 60, radius: 16, color: '#10b981', parent: 'cat-grocery' },
  { id: 'p3', label: 'Amul Milk 1L', type: 'product', status: 'warning', stock: 12, minStock: 20, price: 68, velocity: 'High', x: 770, y: 100, radius: 16, color: '#f59e0b', parent: 'cat-dairy' },
  { id: 'p4', label: 'Parle-G Biscuits', type: 'product', status: 'healthy', stock: 45, minStock: 15, price: 85, velocity: 'High', x: 110, y: 450, radius: 16, color: '#10b981', parent: 'cat-snacks' },
  { id: 'p5', label: 'Thums Up 2L', type: 'product', status: 'healthy', stock: 55, minStock: 20, price: 95, velocity: 'High', x: 200, y: 540, radius: 16, color: '#00f0ff', parent: 'cat-snacks' },
  { id: 'p6', label: 'Surf Excel Matic', type: 'product', status: 'warning', stock: 8, minStock: 15, price: 430, velocity: 'Medium', x: 790, y: 420, radius: 16, color: '#f59e0b', parent: 'cat-personal' },
  { id: 'p7', label: 'Dove Soap 3x100g', type: 'product', status: 'healthy', stock: 35, minStock: 12, price: 165, velocity: 'Low', x: 760, y: 530, radius: 16, color: '#10b981', parent: 'cat-personal' },
  { id: 'p8', label: 'Colgate MaxFresh', type: 'product', status: 'healthy', stock: 40, minStock: 15, price: 115, velocity: 'Medium', x: 620, y: 550, radius: 16, color: '#10b981', parent: 'cat-personal' },
]

export default function NodeGraphCanvas({ onSelectNode, filterMode = 'all' }) {
  const canvasRef = useRef(null)
  const [nodes, setNodes] = useState(initialNodes)
  const [hoveredNode, setHoveredNode] = useState(null)
  const animFrameRef = useRef(null)
  const particlesRef = useRef([])

  // Initialize data streaming particles
  useEffect(() => {
    const pList = []
    initialNodes.forEach(node => {
      if (node.parent) {
        const parentNode = initialNodes.find(n => n.id === node.parent)
        if (parentNode) {
          for (let i = 0; i < 3; i++) {
            pList.push({
              from: parentNode,
              to: node,
              progress: Math.random(),
              speed: 0.003 + Math.random() * 0.005,
              color: node.color
            })
          }
        }
      }
    })
    particlesRef.current = pList
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let time = 0

    const render = () => {
      time += 0.02
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw Grid Lines in Background
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)'
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw Edges / Connected Lines
      nodes.forEach(node => {
        if (node.parent) {
          const parentNode = nodes.find(n => n.id === node.parent)
          if (parentNode) {
            const isHighlighted = hoveredNode && (hoveredNode.id === node.id || hoveredNode.id === parentNode.id)
            
            ctx.beginPath()
            ctx.moveTo(parentNode.x, parentNode.y)
            ctx.lineTo(node.x, node.y)
            ctx.strokeStyle = isHighlighted ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 240, 255, 0.15)'
            ctx.lineWidth = isHighlighted ? 2.5 : 1.2
            ctx.stroke()
          }
        }
      })

      // Update and Draw Data Stream Particles
      particlesRef.current.forEach(p => {
        p.progress += p.speed
        if (p.progress > 1) p.progress = 0

        const px = p.from.x + (p.to.x - p.from.x) * p.progress
        const py = p.from.y + (p.to.y - p.from.y) * p.progress

        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw Nodes
      nodes.forEach(node => {
        // Filter condition check
        const isDimmed = filterMode === 'critical' && node.status !== 'critical'

        // Floating Physics Wiggle
        const offsetX = Math.sin(time + node.x) * 2
        const offsetY = Math.cos(time + node.y) * 2
        const curX = node.x + offsetX
        const curY = node.y + offsetY

        // Node Glow Halo
        const isSelected = hoveredNode?.id === node.id
        const haloRadius = node.radius + (isSelected ? 10 : 4) + Math.sin(time * 3) * 2

        ctx.beginPath()
        ctx.arc(curX, curY, haloRadius, 0, Math.PI * 2)
        ctx.fillStyle = isDimmed ? 'rgba(255,255,255,0.02)' : `${node.color}22`
        ctx.fill()

        // Outer Ring
        ctx.beginPath()
        ctx.arc(curX, curY, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = isDimmed ? '#0f172a' : '#060d21'
        ctx.strokeStyle = isDimmed ? '#334155' : node.color
        ctx.lineWidth = isSelected ? 3 : 2
        ctx.shadowColor = isDimmed ? 'transparent' : node.color
        ctx.shadowBlur = isSelected ? 20 : 10
        ctx.fill()
        ctx.stroke()
        ctx.shadowBlur = 0

        // Center Core Orb
        ctx.beginPath()
        ctx.arc(curX, curY, node.radius * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = isDimmed ? '#475569' : node.color
        ctx.fill()

        // Node Label
        ctx.font = node.type === 'hub' ? 'bold 12px sans-serif' : '11px sans-serif'
        ctx.fillStyle = isDimmed ? '#64748b' : '#e2e8f0'
        ctx.textAlign = 'center'
        ctx.fillText(node.label, curX, curY + node.radius + 16)

        // Status Alert Badge if critical or warning
        if (node.status === 'critical' || node.status === 'warning') {
          const badgeX = curX + node.radius * 0.7
          const badgeY = curY - node.radius * 0.7
          ctx.beginPath()
          ctx.arc(badgeX, badgeY, 6, 0, Math.PI * 2)
          ctx.fillStyle = node.status === 'critical' ? '#ef4444' : '#f59e0b'
          ctx.shadowColor = node.status === 'critical' ? '#ef4444' : '#f59e0b'
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      animFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [nodes, hoveredNode, filterMode])

  // Mouse Interactivity
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const found = nodes.find(node => {
      const dx = mouseX - node.x
      const dy = mouseY - node.y
      return Math.sqrt(dx * dx + dy * dy) <= node.radius + 5
    })

    setHoveredNode(found || null)
    canvas.style.cursor = found ? 'pointer' : 'default'
  }

  const handleClick = (e) => {
    if (hoveredNode && onSelectNode) {
      onSelectNode(hoveredNode)
    }
  }

  return (
    <div className="relative w-full h-[580px] bg-[#040914] rounded-3xl border border-cyan-500/20 overflow-hidden shadow-2xl backdrop-blur-xl">
      <canvas
        ref={canvasRef}
        width={900}
        height={580}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="w-full h-full block"
      />
      
      {/* Canvas Top Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-950/80 border border-cyan-500/30 px-3 py-1.5 rounded-full text-xs text-cyan-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono">NODE GRAPH: ACTIVE CLUSTER (14 NODES)</span>
        </div>

        <div className="text-[10px] font-mono text-gray-400 bg-slate-950/80 border border-cyan-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
          CLICK ANY NODE TO INSPECT METRICS
        </div>
      </div>
    </div>
  )
}
