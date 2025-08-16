import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/authApi';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => loginUser(credentials),
    onSuccess: (data) => {
      if (data.message === "Email not registered") {
        throw new Error("Email not registered");
      } else if (data.message === "Incorrect password") {
        throw new Error("Incorrect password");
      } else {
        login(data);
        navigate('/');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}; 