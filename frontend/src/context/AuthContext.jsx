import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api';
import i18n from '../i18n';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('luxecart_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getMe()
        .then((res) => {
          setUser(res.data);
          // Restore user's preferred language on session restore
          if (res.data.preferred_locale) {
            i18n.changeLanguage(res.data.preferred_locale);
          }
        })
        .catch(() => {
          localStorage.removeItem('luxecart_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginUser = (tokenValue, userData) => {
    localStorage.setItem('luxecart_token', tokenValue);
    setToken(tokenValue);
    setUser(userData);

    // Sync language from user's DB preference on login
    if (userData?.preferred_locale) {
      i18n.changeLanguage(userData.preferred_locale);
    }
  };

  const logout = () => {
    localStorage.removeItem('luxecart_token');
    setToken(null);
    setUser(null);
    // Keep current locale in localStorage — don't reset on logout
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
