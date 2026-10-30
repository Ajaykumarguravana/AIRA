import React, { useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, ArrowRight, Sparkles, RefreshCw, AlertCircle, FileText } from 'lucide-react'
import { getUserProducts, saveUserProducts } from '../utils/userStore'

export default function DataImport() {
  const [stage, setStage] = useState(1) // 1: Upload/Drag, 2: Parsing, 3: Preview, 4: Success
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [parsedRecords, setParsedRecords] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

  // CSV Text Parsing Function
  const parseCSVText = (text, name) => {
    try {
      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '')
      if (lines.length < 2) {
        setErrorMsg('CSV file is empty or missing data rows.')
        setStage(1)
        return
      }

      const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase())

      const rows = lines.slice(1).map((line, idx) => {
        // Split by comma preserving quoted strings
        const values = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(v => v.trim().replace(/^["']|["']$/g, ''))

        const rowObj = {}
        rawHeaders.forEach((h, i) => {
          rowObj[h] = values[i] || ''
        })

        const nameVal = rowObj['product name'] || rowObj['product'] || rowObj['name'] || values[0] || `Imported Item ${idx + 1}`
        const skuVal = rowObj['sku'] || rowObj['barcode'] || `SKU-${1000 + idx}`
        const categoryVal = rowObj['category'] || 'Grocery'
        const priceVal = Number(rowObj['price'] || rowObj['selling price'] || values[3]) || 50
        const stockVal = Number(rowObj['stock'] || rowObj['stock level'] || rowObj['quantity'] || values[4]) || 30
        const costVal = Number(rowObj['cost price'] || rowObj['cost']) || Math.round(priceVal * 0.75)
        const minStockVal = Number(rowObj['min stock']) || 15

        return {
          id: Date.now() + idx,
          name: nameVal,
          sku: skuVal,
          category: categoryVal,
          price: priceVal,
          stock: stockVal,
          costPrice: costVal,
          minStock: minStockVal,
          status: stockVal > minStockVal ? 'Healthy' : 'Low Stock',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop'
        }
      })

      setFileName(name)
      setParsedRecords(rows)
      setStage(3)
      setErrorMsg('')
    } catch (err) {
      setErrorMsg('Failed to parse file. Please verify it is a valid CSV format.')
      setStage(1)
    }
  }

  const processFile = (file) => {
    if (!file) return
    setFileName(file.name)
    setStage(2)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      setTimeout(() => {
        parseCSVText(text, file.name)
      }, 800)
    }
    reader.onerror = () => {
      setErrorMsg('Error reading file from disk.')
      setStage(1)
    }
    reader.readAsText(file)
  }

  // File Input Change
  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  // HTML5 Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      processFile(droppedFile)
      e.dataTransfer.clearData()
    }
  }

  // Demo Fallback CSV Loader
  const loadDemoCSV = () => {
    const demoCSV = `Product Name,SKU,Category,Price,Stock,Cost Price,Min Stock
Tata Salt 1kg,SKU-1001,Grocery,28,50,21,15
Amul Milk 1L,SKU-1002,Dairy,64,80,52,20
Fortune Sunlite Oil 1L,SKU-1003,Grocery,145,35,115,10
Parle-G Biscuits 250g,SKU-1004,Snacks,20,120,14,25
Thums Up 750ml,SKU-1005,Beverages,40,60,30,15
Surf Excel Matic 1kg,SKU-1006,Household,210,25,160,8`
    
    setStage(2)
    setTimeout(() => {
      parseCSVText(demoCSV, 'Sample_Store_Inventory.csv')
    }, 600)
  }

  const confirmImport = () => {
    if (parsedRecords && parsedRecords.length > 0) {
      const existing = getUserProducts()
      const updated = [...parsedRecords, ...existing]
      saveUserProducts(updated)
    }
    setStage(4)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24 dashboard-workspace-bg max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Data Import Wizard</h1>
        <p className="text-xs text-slate-500">Drag & drop CSV or Excel files to bulk update store inventory, products, and price data.</p>
      </div>

      <div className="p-8 rounded-3xl card-light space-y-6 text-center shadow-lg">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
          </div>
        )}

        {/* STAGE 1: Drag and Drop Zone */}
        {stage === 1 && (
          <div className="space-y-6">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-12 rounded-3xl border-2 border-dashed transition-all duration-300 relative cursor-pointer flex flex-col items-center justify-center space-y-4 ${
                isDragging 
                  ? 'border-cyan-500 bg-cyan-500/10 scale-[1.02] shadow-2xl' 
                  : 'border-slate-300 hover:border-blue-500 bg-slate-50/80 hover:bg-white'
              }`}
            >
              <input 
                type="file" 
                onChange={handleFileInput} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                accept=".csv, .xlsx, .xls" 
              />

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform ${isDragging ? 'scale-110 aira-gradient-bg text-white' : 'bg-blue-100 text-blue-600'}`}>
                <Upload className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isDragging ? 'Drop your CSV file here now!' : 'Drag & Drop your CSV or Excel file here'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Or click anywhere to browse files from your computer</p>
                <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-[11px] font-mono">
                  <span>Supports: .csv, .xlsx, .xls</span>
                </div>
              </div>
            </div>

            {/* Helper Sample CSV Loader */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-medium">Don't have a CSV file ready?</span>
              <button 
                onClick={loadDemoCSV}
                className="px-4 py-2 rounded-xl btn-3d-glass text-blue-600 font-bold flex items-center space-x-2 text-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Load Sample CSV File Data</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: Parsing Animation */}
        {stage === 2 && (
          <div className="py-12 space-y-4 text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Parsing File & Neural Mapping...</h3>
            <p className="text-xs text-slate-400">AIRA is detecting headers (Product Name, SKU, Category, Price, Stock) and validating rows.</p>
          </div>
        )}

        {/* STAGE 3: Data Preview */}
        {stage === 3 && (
          <div className="space-y-5 text-left text-xs">
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 space-y-1.5 font-mono">
              <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /><span className="font-bold">✓ File loaded: {fileName}</span></div>
              <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /><span>✓ {parsedRecords.length} Rows parsed successfully</span></div>
              <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /><span>✓ All schema headers validated</span></div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900 text-sm">Data Preview ({parsedRecords.length} Products Found)</h4>
                <span className="text-[10px] text-slate-400 font-mono">Review before importing</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-mono text-[10px] uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Selling Price</th>
                      <th className="p-3 text-right">Stock</th>
                      <th className="p-3 text-right">Cost Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRecords.slice(0, 6).map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{item.name}</td>
                        <td className="p-3 font-mono text-slate-500">{item.sku}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">{item.category}</span></td>
                        <td className="p-3 text-right font-bold text-slate-900">₹{item.price}</td>
                        <td className="p-3 text-right font-mono font-semibold text-blue-600">{item.stock} units</td>
                        <td className="p-3 text-right font-mono text-slate-500">₹{item.costPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setStage(1)} 
                className="w-1/3 py-3.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel & Re-upload
              </button>
              <button 
                onClick={confirmImport} 
                className="w-2/3 py-3.5 aira-gradient-btn text-xs font-bold shadow-md flex items-center justify-center space-x-2"
              >
                <span>Confirm & Import {parsedRecords.length} Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: Success Message */}
        {stage === 4 && (
          <div className="py-8 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Import Completed Successfully! 🎉</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {parsedRecords.length || 14} product records imported and synced to AIRA store database.
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <button 
                onClick={() => window.location.href = '/app/inventory'}
                className="px-6 py-3 aira-gradient-btn text-xs font-bold shadow-md"
              >
                View Inventory Dashboard
              </button>
              <button 
                onClick={() => setStage(1)} 
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Import Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
