import React from 'react';
import { Navigate } from 'react-router-dom';

const AddGarageProductPage = () => {
  // Redirect to the main add product page
  return <Navigate to="/products/add" replace />;
};

export default AddGarageProductPage; 