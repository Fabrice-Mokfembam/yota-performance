import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { useDeleteProduct, useGetProducts } from "../hooks/useProducts";
import { toast } from 'react-toastify';

const items = [
  "Exhaust",
  "Suspension parts",
  "Wheel",
  "Rear Spoilers",
  "Hood",
  "Bumpers",
  "Fenders",
  "Rear Trunk",
  "Lighting kit",
  "Shift knob & pedals",
  "Steering wheel & Airbags",
  "Seats & Covers",
  "Dashboard panel",
  "Center console",
  "Floor mats",
  "Door & trim panels",
  "Steering wheel",
  "Head Lights",
  "Tail Lights",
  "Front Lip",
  "Side skirt",
  "Rear diffuser",
  "Side mirrors & covers",
  "Front grille",
  "Bumper grille",
  "Covers",
];

function ProductList() {
  const { data: products = [], isLoading: loading, error, refetch, isFetching } = useGetProducts();

  // Debug logging
  // console.log('Products loading state:', loading);
  // console.log('Products data:', products);
  // console.log('Products error:', error);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemsPerPage] = useState(9);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const deleteProductMutation = useDeleteProduct();
  const routeTo = useNavigate();

  function routeToAddProduct() {
    routeTo("/products/add");
  }

  // Pass product data when going to detail page using navigate state
  const routeToProductDetail = (product) => {
    routeTo(`/products/detail/${product.id}`, { state: { product } });
  };

  // Filter products directly on render
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const reversedFilteredProducts = [...filteredProducts].reverse();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = reversedFilteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleDeleteProduct = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setProductToDelete(product);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;

    deleteProductMutation.mutate(productToDelete.id, {
      onSuccess: () => {
        toast.success('Product deleted successfully!');
        setShowDeleteModal(false);
        setProductToDelete(null);
      },
      onError: (error) => {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product. Please try again.');
      },
    });
  };

  const handleRetry = async () => {
    try {
      await refetch();
      toast.success('Products loaded successfully!');
    } catch (error) {
      console.error("Error retrying products fetch:", error);
      toast.error('Failed to load products. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-600 mt-1">Manage your product inventory</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search product by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select by category</option>
                {items.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Count */}
            <div className="text-sm text-gray-600">
              {filteredProducts.length} products found
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {isFetching && !loading ? 'Retrying...' : 'Loading products...'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {isFetching && !loading ? 'Retrying automatically...' : 'This may take a moment if the server is busy'}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">
              {error.code === 'ECONNABORTED' ? 'Connection timeout' : 'Error loading products'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {error.code === 'ECONNABORTED'
                ? 'The server is taking too long to respond. This might be due to high server load or network issues.'
                : error.message}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                disabled={isFetching}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Retrying...
                  </>
                ) : (
                  'Retry Now'
                )}
              </button>
              {error.code === 'ECONNABORTED' && (
                <button
                  onClick={handleRetry}
                  disabled={isFetching}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Try Again Later
                </button>
              )}
            </div>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600 mb-2">No products found</p>
            <p className="text-sm text-gray-500">
              {filteredProducts.length === 0 && products.length > 0
                ? "Try adjusting your search or filter criteria"
                : "No products have been added yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.reverse().map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative cursor-pointer" onClick={() => routeToProductDetail(item)}>
                  <img src={item.images[0]} alt="product" className="w-full h-48 object-cover" />
                </div>
                <div className="p-4">
                  <div
                    className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => routeToProductDetail(item)}
                  >
                    {item.product_name.length > 40 ? item.product_name.slice(0, 40) + "..." : item.product_name}
                  </div>
                  <div
                    className="text-sm text-gray-600 mt-2 cursor-pointer"
                    onClick={() => routeToProductDetail(item)}
                    dangerouslySetInnerHTML={{ __html: item.description.slice(0, 40) }}
                  />
                  <div className="text-lg font-bold text-blue-600 mt-2">${item.price}</div>
                  <div className="flex space-x-2 mt-3">
                    <button
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      onClick={() => routeToProductDetail(item)}
                    >
                      View
                    </button>
                    <button
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                      onClick={() => handleDeleteProduct(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Product Button */}
        <div
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
          onClick={routeToAddProduct}
        >
          <Plus className="text-white h-6 w-6" />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{productToDelete.product_name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
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
}

export default ProductList;
