import { useState, useEffect } from 'react';
import type { User } from '../types';
import { getProfile } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('stav_token');
    if (!token) {
      setState({ user: null, isAuthenticated: false, loading: false });
      return;
    }

    getProfile()
      .then(user => {
        setState({ user: user as User, isAuthenticated: true, loading: false });
      })
      .catch(() => {
        localStorage.removeItem('stav_token');
        setState({ user: null, isAuthenticated: false, loading: false });
      });
  }, []);

  const logout = () => {
    localStorage.removeItem('stav_token');
    setState({ user: null, isAuthenticated: false, loading: false });
  };

  return { ...state, logout };
}

export default useAuth;
