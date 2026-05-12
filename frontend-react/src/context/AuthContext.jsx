import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const MOCK_USERS = {
  client: { id: 1, name: 'Carlos García', email: 'garcia@empresa.com', role: 'client', avatar: 'CG' },
  store: { id: 2, name: 'Admin LogisTrade', email: 'admin@logistrade.com', role: 'store', avatar: 'AL' },
  admin: { id: 3, name: 'Super Admin', email: 'superadmin@tos.com', role: 'admin', avatar: 'SA' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
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
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error('Error al registrar');
      const data = await res.json();
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

  // Demo login bypass for UI testing
  const demoLogin = (role) => {
    const mockUser = {
      client: { id: 1, name: 'Carlos García', firstName: 'Carlos', lastName: 'García', email: 'garcia@empresa.com', role: 'client', avatar: 'CG' },
      store: { id: 2, name: 'Admin LogisTrade', firstName: 'Admin', lastName: 'LogisTrade', email: 'admin@logistrade.com', role: 'store', avatar: 'AL' },
      admin: { id: 3, name: 'Super Admin', firstName: 'Super', lastName: 'Admin', email: 'superadmin@tos.com', role: 'admin', avatar: 'SA' },
    }[role];
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, demoLogin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
