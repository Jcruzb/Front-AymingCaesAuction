import { createContext, useState, useContext, useEffect } from 'react';
import { setAccessToken, getAccessToken, logout } from '../stores/AccessTokenStore';
import { getCurrentUser } from '../Services/UserService';
import { verifyJWT } from '../utils/jwtHelpers';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthenticationFetched, setIsAuthenticationFetched] = useState(false);

  const login = (token, navigateCb) => {
    setAccessToken(token)
    getUser(navigateCb)
  }

  const getUser = (cb) => {
    getCurrentUser()
      .then(user => {
        setUser(user);
        setIsAuthenticationFetched(true);

        cb && cb();
      })
      .catch(err => {
        console.log(err);
        setIsAuthenticationFetched(true);
      });
  }

  useEffect(() => {
    if (getAccessToken()) {
      if ( !verifyJWT(getAccessToken()) ) {
        logout();
      } else {
        getUser();
      }
    } else {
      setIsAuthenticationFetched(true)
    }
  }, [])

  const handleLogout = () => {
    logout(); // ← Llama a la función importada de AccessTokenStore
    setUser(null); // ← Limpia el usuario en el estado del contexto
    setIsAuthenticationFetched(false); // ← Resetea el estado de autenticación
  };

  const value = {
    user: user || null,
    isAuthenticationFetched,
    login,
    logout: handleLogout,
    getUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthContext;
