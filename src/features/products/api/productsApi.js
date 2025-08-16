// import axios from 'axios';
import api from '../../../services/axios';

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get('/admin/get_products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The server is taking too long to respond. Please try again.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred. Please try again later.');
    } else if (error.response?.status === 404) {
      throw new Error('Products endpoint not found. Please contact support.');
    } else if (error.response?.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to fetch products. Please try again.');
    }
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const response = await api.post('/admin/add_products', productData, {
      maxContentLength: 1000000
    });
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to add product');
  }
};

// Upload images
export const uploadImages = async (formData) => {
  try {
    const response = await api.post('/admin/upload_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading images:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Upload timed out. Please try again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to upload images');
  }
};

// Update product
export const updateProduct = async (id, productData) => {

  console.log('Updating product with ID:', id, 'and data:', productData,"data:", {id, ...productData, reviews: [
               {
                 user_text: "Sample review",
                 user_rating: 5,
                 user_name: "John Doe",
                 user_id: "123456789",
               },
             ],});
  try {
    const response = await api.put(`/admin/update_product/`, {id,...productData, reviews: [
               {
                 user_text: "Sample review",
                 user_rating: 5,
                 user_name: "John Doe",
                 user_id: "123456789",
               },
             ],}, { maxContentLength: 1000000 });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await api.post('/admin/delete_product', { id }); 
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};


// Get product by ID
export const getProductById = async (id) => {
  try {
    console.error('fetching product', id);
    const response = await api.post('/get_product_id', { id });
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch product details');
  }
}; 