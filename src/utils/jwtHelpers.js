import { jwtDecode } from 'jwt-decode';

export const verifyJWT = (token) => {
  const decodedToken = jwtDecode(token);

  return Date.now() <= decodedToken.exp * 1000;
};