import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getProductById,
  uploadImages
} from '../api/productsApi';
import { useContext } from 'react';
import { ProductContext } from '../../../context/ProductContext';


// Get all products
export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
 
  });
};

// Get product by ID
export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

// Add product mutation
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData) => addProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate 'products' cache to refetch updated products list after deleting one
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      // Optionally, you can handle global errors here or let it bubble up
      console.error('Delete product mutation error:', error);
    },
  });
};

// Upload images mutation
export const useUploadImages = () => {
  return useMutation({
    mutationFn: (formData) => uploadImages(formData),
  });
}; 

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};