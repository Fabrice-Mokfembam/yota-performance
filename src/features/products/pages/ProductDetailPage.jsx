import React, { useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useProduct, useDeleteProduct } from '../hooks/useProducts';
import { toast } from 'react-toastify';
import { 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Star, 
  Package, 
  DollarSign, 
  Settings,
  Tag,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const AccordionSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-sm border mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="text-blue-600">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-6 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id);
  const deleteProductMutation = useDeleteProduct();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success('Product deleted successfully!');
      navigate('/products/list');
    } catch (err) {
      toast.error('Failed to delete product. Please try again.',err);
    }
    setShowDeleteModal(false);
  };

  const renderHtmlContent = (htmlString) => (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Error loading product. Please try again.</p>
          <button
            onClick={() => navigate('/products/list')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={() => navigate('/products/list')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between py-4 space-y-3  md:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/products/list')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                aria-label="Back to product list"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.product_name}</h1>
                <p className="text-sm text-gray-600">Product ID: {product.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 border border-blue-600 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center px-4 py-2 text-red-600 bg-red-50 border border-red-600 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:space-x-10">
        {/* Left Column - Images */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
          {/* Large Image */}
          {images.length > 0 ? (
            <img
              src={images[selectedImageIndex]}
              alt={`Product large ${selectedImageIndex + 1}`}
              className="w-full max-w-lg rounded-lg object-cover"
              onError={(e) => (e.target.src = '/placeholder-image.jpg')}
            />
          ) : (
            <div className="w-full max-w-lg rounded-lg border bg-gray-100 h-96 flex items-center justify-center text-gray-400">
              No images available
            </div>
          )}

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex space-x-3 mt-4 overflow-x-auto w-full max-w-lg">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  type="button"
                  className={`flex-shrink-0 w-20 h-20 rounded-md border-2 ${
                    idx === selectedImageIndex ? 'border-blue-600' : 'border-transparent'
                  } focus:outline-none`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="flex-1 mt-8 md:mt-0">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold text-gray-900">${product.price}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Package className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Stock</p>
                  <p className="font-semibold text-gray-900">{product.quantity_left}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-semibold text-gray-900">{product.rating || '0.0'}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Tag className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="font-semibold text-gray-900">{product.sku}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <p className="mt-1 text-gray-900">{product.product_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Car Brand</label>
                  <p className="mt-1 text-gray-900">{product.car_brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Car Model</label>
                  <p className="mt-1 text-gray-900">{product.car_model}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="mt-1 text-gray-900">{product.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                  <p className="mt-1 text-gray-900">{product.subcategory || 'N/A'}</p>
                </div>
              </div>

              {product.final_subcategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Final Subcategory</label>
                  <p className="mt-1 text-gray-900">{product.final_subcategory}</p>
                </div>
              )}

              {product.category_brand && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category Brand</label>
                  <p className="mt-1 text-gray-900">{product.category_brand}</p>
                </div>
              )}

              {product.wheel_size && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Wheel Size</label>
                  <p className="mt-1 text-gray-900">{product.wheel_size}</p>
                </div>
              )}

              {product.make_material && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Make Material</label>
                  <p className="mt-1 text-gray-900">{product.make_material}</p>
                </div>
              )}

              {product.fit_position && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fit Position</label>
                  <p className="mt-1 text-gray-900">{product.fit_position}</p>
                </div>
              )}
            </div>
          </div>

      
        </div>
      </div>
<div className='p-8'>
      {/* Accordion Sections for Description, Features & Fitment */}
          {product.description && (
            <AccordionSection title="Description">
              <div className="prose prose-sm max-w-none">{renderHtmlContent(product.description)}</div>
            </AccordionSection>
          )}

          {product.features && (
            <AccordionSection title="Features">
              <div className="prose prose-sm max-w-none">{renderHtmlContent(product.features)}</div>
            </AccordionSection>
          )}

          {product.fitment && (
            <AccordionSection title="Fitment">
              <div className="prose prose-sm max-w-none">{renderHtmlContent(product.fitment)}</div>
            </AccordionSection>
          )}

          {/* Product Video */}
          {product.video && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Video</h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${product.video}`}
                  title="Product Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
</div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{product.product_name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteProductMutation.isPending}
                className="px-4 py-2 text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;