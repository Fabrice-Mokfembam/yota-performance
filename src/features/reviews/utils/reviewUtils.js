// Review utility functions

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
};

export const formatReviewDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const validateReviewData = (reviewData) => {
  const errors = {};
  
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  
  if (!reviewData.comment || reviewData.comment.trim().length < 10) {
    errors.comment = 'Review comment must be at least 10 characters';
  }
  
  return errors;
}; 