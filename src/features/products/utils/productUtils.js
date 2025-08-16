// Format price with currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Get stock status color
export const getStockStatusColor = (quantity) => {
  if (quantity > 10) return 'green';
  if (quantity > 0) return 'yellow';
  return 'red';
};

// Get stock status text
export const getStockStatusText = (quantity) => {
  if (quantity > 10) return 'In Stock';
  if (quantity > 0) return 'Low Stock';
  return 'Out of Stock';
};

// Validate product data
export const validateProductData = (data) => {
  const errors = {};
  
  if (!data.product_name) errors.product_name = 'Product name is required';
  if (!data.price || data.price <= 0) errors.price = 'Valid price is required';
  if (!data.quantity_left || data.quantity_left < 0) errors.quantity_left = 'Valid quantity is required';
  if (!data.car_brand) errors.car_brand = 'Car brand is required';
  if (!data.car_model) errors.car_model = 'Car model is required';
  if (!data.category) errors.category = 'Category is required';
  
  return errors;
};

// Filter products by search term
export const filterProductsBySearch = (products, searchTerm) => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.product_name?.toLowerCase().includes(term) ||
    product.car_brand?.toLowerCase().includes(term) ||
    product.car_model?.toLowerCase().includes(term) ||
    product.category?.toLowerCase().includes(term)
  );
};

// Sort products
export const sortProducts = (products, sortBy = 'name', sortOrder = 'asc') => {
  return [...products].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'price' || sortBy === 'quantity_left') {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    } else {
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
    }
    
    if (sortOrder === 'desc') {
      return aValue < bValue ? 1 : -1;
    }
    return aValue > bValue ? 1 : -1;
  });
}; 