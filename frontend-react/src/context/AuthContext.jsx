import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const MOCK_USERS = {
  client: { id: 1, name: 'Carlos Cliente', email: 'client@tos.com', role: 'client', avatar: 'CC' },
  store: { id: 2, name: 'Pedro Tienda', email: 'store@tos.com', role: 'store', avatar: 'PT' },
  admin: { id: 3, name: 'Super Admin', email: 'admin@tos.com', role: 'admin', avatar: 'SA' },
};

import API_BASE_URL from '../config/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Credenciales inválidas');
      
      const data = json.data;
      const normalizedUser = {
        ...data.user,
        name: `${data.user.firstName} ${data.user.lastName}`,
        avatar: data.user.firstName.charAt(0) + data.user.lastName.charAt(0)
      };
      setUser(normalizedUser);
      setToken(data.access_token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('token', data.access_token);
      return normalizedUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al registrar');
      
      const data = json.data;
      const normalizedUser = {
        ...data.user,
        name: `${data.user.firstName} ${data.user.lastName}`,
        avatar: data.user.firstName.charAt(0) + data.user.lastName.charAt(0)
      };
      setUser(normalizedUser);
      setToken(data.access_token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('token', data.access_token);
      return normalizedUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const demoLogin = async (role) => {
    const credentials = {
      client: { email: 'client@tos.com', password: 'password123' },
      store: { email: 'store@tos.com', password: 'password123' },
      admin: { email: 'admin@tos.com', password: 'password123' },
    }[role];
    if (!credentials) throw new Error('Rol demo inválido');
    return login(credentials.email, credentials.password);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, demoLogin, isAuthenticated: !!user && !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
