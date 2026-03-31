import { useState, useEffect, useMemo } from 'react'
import { getProducts } from '../services/api'
import AddProductModal from './AddProductModal'
import EditProductModal from './EditProductModal'
import DeleteModal from './DeleteModal'

function ProductTable({ refreshTrigger, onProductChanged }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Filter and sort states
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await getProducts()
      setProducts(res.data)
    } catch (err) {
      setError('Failed to fetch products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [refreshTrigger])

  // Handle column header click for sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  // Filter and sort using useMemo for performance
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter)
    }

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        let aVal = a[sortField]
        let bVal = b[sortField]

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
          if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
          if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
          return 0
        }

        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    return result
  }, [products, search, categoryFilter, sortField, sortOrder])

  const getStatus = (stock) => {
    if (stock <= 0) return (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500 bg-opacity-10 border border-red-500 border-opacity-25 text-white">
        Out of stock
      </span>
    )
    if (stock < 10) return (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-25 text-white">
        Low stock
      </span>
    )
    return (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500 bg-opacity-10 border border-emerald-500 border-opacity-25 text-white">
        Active
      </span>
    )
  }

  const handleProductAdded = () => {
    fetchProducts()
    onProductChanged()
  }

  const handleProductUpdated = () => {
    fetchProducts()
    onProductChanged()
  }

  const handleProductDeleted = () => {
    fetchProducts()
    onProductChanged()
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-3 mb-4 items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#171724] border border-[#25253a] text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500 placeholder-gray-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#171724] border border-[#25253a] text-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="">All categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Furniture">Furniture</option>
          <option value="Other">Other</option>
        </select>

        {/* Sort */}
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="bg-[#171724] border border-[#25253a] text-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="">Sort by...</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="stock">Stock</option>
        </select>

        {/* Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-[#171724] border border-[#25253a] rounded-xl overflow-hidden">

        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#25253a]">
          <span className="text-white text-sm font-semibold">
            Active Products
          </span>
          <span className="text-xs font-mono text-gray-400 bg-[#13131e] border border-[#25253a] px-3 py-1 rounded-full">
            {filteredProducts.length} products
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400 text-sm py-10">
            Loading products...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-400 text-sm py-10">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-10">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-gray-400 text-sm">No products found</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredProducts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#13131e]">
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">
                    ID
                  </th>
                  <th
                    className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th
                    className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('category')}
                  >
                    Category {getSortIcon('category')}
                  </th>
                  <th
                    className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('price')}
                  >
                    Price {getSortIcon('price')}
                  </th>
                  <th
                    className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-white"
                    onClick={() => handleSort('stock')}
                  >
                    Stock {getSortIcon('stock')}
                  </th>
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-[#25253a] hover:bg-[#1a1a2e] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      #{String(product.id).padStart(3, '0')}
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-white">
                      ₹{Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {product.stock}
                    </td>
                    <td className="px-4 py-3">
                      {getStatus(product.stock)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowEditModal(true)
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 text-white font-semibold hover:bg-opacity-20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowDeleteModal(true)
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-white font-semibold hover:bg-opacity-20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setShowEditModal(false)
            setSelectedProduct(null)
          }}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {showDeleteModal && selectedProduct && (
        <DeleteModal
          product={selectedProduct}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedProduct(null)
          }}
          onProductDeleted={handleProductDeleted}
        />
      )}
    </div>
  )
}

export default ProductTable