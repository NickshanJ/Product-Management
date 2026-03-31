import { useState } from 'react'
import { deleteProduct } from '../services/api'

function DeleteModal({ product, onClose, onProductDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteProduct(product.id)
      onProductDeleted()
      onClose()
    } catch (err) {
      setError('Failed to delete product. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] border border-[#25253a] rounded-2xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-bold">Confirm Delete</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-[#13131e] border border-[#25253a] rounded-lg w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Icon and Message */}
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-500 bg-opacity-10 border border-red-500 border-opacity-25 flex items-center justify-center text-3xl mb-4">
            🗑
          </div>

          <h3 className="text-white font-bold text-base mb-2">
            Delete "{product?.name}"?
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed">
            This will not permanently remove the product.
            <br />
            It will move to the{' '}
            <span className="text-orange-400 font-medium">Recycle Bin</span>{' '}
            below.
            <br />
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-[#25253a] text-gray-400 hover:text-white text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-2 w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default DeleteModal