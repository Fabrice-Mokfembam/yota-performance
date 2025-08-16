// Order utility functions

export const formatOrderDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getOrderStatusColor = (status) => {
  const statusColors = {
    'pending': 'text-yellow-600 bg-yellow-100',
    'processing': 'text-blue-600 bg-blue-100',
    'shipped': 'text-purple-600 bg-purple-100',
    'delivered': 'text-green-600 bg-green-100',
    'cancelled': 'text-red-600 bg-red-100'
  };
  
  return statusColors[status] || 'text-gray-600 bg-gray-100';
};

export const validateOrderData = (orderData) => {
  const errors = {};
  
  if (!orderData.customerId) {
    errors.customerId = 'Customer is required';
  }
  
  if (!orderData.items || orderData.items.length === 0) {
    errors.items = 'Order must contain at least one item';
  }
  
  return errors;
};