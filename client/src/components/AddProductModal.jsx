import { useState } from 'react'
import { addProduct } from '../services/api'

function AddProductModal({ onClose, onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.price || !formData.stock) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await addProduct(formData)
      onProductAdded()
      onClose()
    } catch (err) {
      setError('Failed to add product. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] border border-[#25253a] rounded-2xl w-full max-w-md p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-bold">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-[#13131e] border border-[#25253a] rounded-lg w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Name */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Mouse"
              className="w-full bg-[#13131e] border border-[#25253a] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#13131e] border border-[#25253a] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 1299"
              className="w-full bg-[#13131e] border border-[#25253a] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 50"
              className="w-full bg-[#13131e] border border-[#25253a] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-[#25253a] text-gray-400 hover:text-white text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddProductModal