import { useState, useEffect } from 'react';
import { getReviews } from '../api/reviewsApi';

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return { reviews, loading, error, refetch: fetchReviews };
}; 