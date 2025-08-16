import React from 'react';
import { X, Check } from 'lucide-react';

const ProductPreview = ({ product, onClose, onConfirm, onCancel, isLoading }) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Product Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`Product ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No images selected</p>
                </div>
              )}
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <p className="mt-1 text-sm text-gray-900">{product.product_name || 'Not specified'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="mt-1 text-sm text-gray-900">${product.price || '0.00'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <p className="mt-1 text-sm text-gray-900">{product.quantity_left || '0'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Car Brand</label>
                      <p className="mt-1 text-sm text-gray-900">{product.car_brand || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Car Model</label>
                      <p className="mt-1 text-sm text-gray-900">{product.car_model || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="mt-1 text-sm text-gray-900">{product.category || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                      <p className="mt-1 text-sm text-gray-900">{product.subcategory || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hot Product</label>
                      <p className="mt-1 text-sm text-gray-900">{product.hot_product ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Performance Part</label>
                      <p className="mt-1 text-sm text-gray-900">{product.performance_part ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  {product.make_material && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Make Material</label>
                      <p className="mt-1 text-sm text-gray-900">{product.make_material}</p>
                    </div>
                  )}

                  {product.wheel_size && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Wheel Size</label>
                      <p className="mt-1 text-sm text-gray-900">{product.wheel_size}</p>
                    </div>
                  )}

                  {product.video && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">YouTube Video ID</label>
                      <p className="mt-1 text-sm text-gray-900">{product.video}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rich Text Content */}
              {(product.description || product.features || product.fitment) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Content</h3>
                  
                  {product.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <div 
                        className="mt-1 text-sm text-gray-900 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </div>
                  )}

                  {product.features && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Features</label>
                      <div 
                        className="mt-1 text-sm text-gray-900 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.features }}
                      />
                    </div>
                  )}

                  {product.fitment && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fitment</label>
                      <div 
                        className="mt-1 text-sm text-gray-900 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.fitment }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Product...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Add Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview; 