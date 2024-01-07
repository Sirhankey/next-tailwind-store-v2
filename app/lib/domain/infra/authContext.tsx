// authContext.tsx

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { signIn, signOut } from '@/auth';

interface AuthContextProps {
  user: string | null;
  login: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o usuário está autenticado (por exemplo, através de um token)
    // e definir o usuário no estado.
    const authenticatedUser = localStorage.getItem('authenticatedUser');
    if (authenticatedUser) {
      setUser(authenticatedUser);
    }
  }, []);

  const login = async (formData: FormData) => {
    try {
      await signIn('credentials', formData);
      // Obter informações do usuário logado (por exemplo, através de uma API)
      // Substitua o código abaixo pelo método real para obter informações do usuário.
      const authenticatedUser = localStorage.getItem('authenticatedUser');
      setUser(authenticatedUser);
    } catch (error) {
      // Handle errors
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: true });
      setUser(null);
      localStorage.removeItem('authenticatedUser');
    } catch (error) {
      // Handle errors
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
