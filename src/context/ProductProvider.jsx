
import { useEffect, useState } from 'react';
import api from '../services/axios';
import { ProductContext } from './ProductContext';


export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/get_products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts, loading, setLoading }}>
      {children}
    </ProductContext.Provider>
  );
};
