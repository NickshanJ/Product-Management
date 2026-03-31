import { useState } from 'react'
import ProductTable from './components/ProductTable'
import RecycleBin from './components/RecycleBin'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleProductChanged = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">

      {/* NAV */}
      <nav className="bg-[#13131e] border-b border-[#25253a] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
            <span className="text-white font-bold text-base">
              Product Manager
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400 bg-[#0d0d14] border border-[#25253a] px-3 py-1 rounded-full">
              React + Express + MySQL
            </span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            Products
          </h1>
        </div>

        {/* Task 1 + Task 2 — Product Table with CRUD */}
        <ProductTable
          refreshTrigger={refreshTrigger}
          onProductChanged={handleProductChanged}
        />

        {/* Task 3 — Recycle Bin */}
        <RecycleBin
          refreshTrigger={refreshTrigger}
          onRestored={handleProductChanged}
        />

      </main>

    </div>
  )
}

export default App