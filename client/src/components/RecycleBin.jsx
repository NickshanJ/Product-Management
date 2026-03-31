import { useState, useEffect } from 'react'
import { getDeletedProducts, restoreProduct } from '../services/api'

function RecycleBin({ refreshTrigger, onRestored }) {
  const [deletedProducts, setDeletedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [restoringId, setRestoringId] = useState(null)
  const [error, setError] = useState('')

  const fetchDeletedProducts = async () => {
    try {
      setLoading(true)
      const res = await getDeletedProducts()
      setDeletedProducts(res.data)
    } catch (err) {
      setError('Failed to fetch deleted products.')
    } finally {
      setLoading(false)
    }
  }

  // Refetch whenever refreshTrigger changes
  useEffect(() => {
    fetchDeletedProducts()
  }, [refreshTrigger])

  const getDaysAgo = (deletedAt) => {
    const deleted = new Date(deletedAt)
    const now = new Date()
    const diff = Math.floor((now - deleted) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getAgeColor = (days) => {
    if (days >= 30) return 'text-red-400'
    if (days >= 10) return 'text-orange-400'
    return 'text-emerald-400'
  }

  const getAgeDotColor = (days) => {
    if (days >= 30) return 'bg-red-500'
    if (days >= 10) return 'bg-orange-400'
    return 'bg-emerald-500'
  }

  const handleRestore = async (product) => {
    const days = getDaysAgo(product.deleted_at)
    if (days >= 30) return

    try {
      setRestoringId(product.id)
      await restoreProduct(product.id)
      onRestored()
      fetchDeletedProducts()
    } catch (err) {
      if (err.response?.data?.error) {
        alert(err.response.data.error)
      } else {
        alert('Failed to restore product.')
      }
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <div className="mt-10">

      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-25 flex items-center justify-center text-base">
          🗑
        </div>
        <h2 className="text-white text-base font-bold">Recycle Bin</h2>
        <span className="text-gray-400 text-sm ml-auto">
          Soft-deleted products · restore within 30 days
        </span>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-4">
        <span className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          Under 10 days — safe
        </span>
        <span className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
          10–29 days — restore soon
        </span>
        <span className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
          30+ days — blocked by trigger
        </span>
      </div>

      {/* Table Card */}
      <div className="bg-[#171724] border border-[#25253a] rounded-xl overflow-hidden">

        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#25253a]">
          <span className="text-white text-sm font-semibold">
            Deleted Products
          </span>
          <span className="text-xs font-mono text-gray-400 bg-[#13131e] border border-[#25253a] px-3 py-1 rounded-full">
            {deletedProducts.length} items
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400 text-sm py-8">
            Loading...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-400 text-sm py-8">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && deletedProducts.length === 0 && (
          <div className="text-center py-10">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-gray-400 text-sm">
              Recycle bin is empty
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && deletedProducts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#13131e]">
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">ID</th>
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">Name</th>
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">Category</th>
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">Price</th>
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">Stock</th>
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">Deleted At</th>
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">Age</th>
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {deletedProducts.map((product) => {
                  const days = getDaysAgo(product.deleted_at)
                  const isBlocked = days >= 30

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-[#25253a] hover:bg-[#1a1a2e] transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-white">
                        #{String(product.id).padStart(3, '0')}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-white text-xs">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-white">
                        ₹{Number(product.price).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {product.stock}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-white">
                        {new Date(product.deleted_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 text-xs font-mono ${getAgeColor(days)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getAgeDotColor(days)}`}></span>
                          {days}d ago
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isBlocked ? (
                          <button
                            disabled
                            className="text-xs px-3 py-1.5 rounded-lg border border-[#25253a] text-gray-500 cursor-not-allowed opacity-50"
                          >
                            Blocked
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(product)}
                            disabled={restoringId === product.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 bg-opacity-10 border border-emerald-500 border-opacity-30 text-white font-bold hover:bg-opacity-20 disabled:opacity-50"
                          >
                            {restoringId === product.id ? 'Restoring...' : 'Restore'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default RecycleBin