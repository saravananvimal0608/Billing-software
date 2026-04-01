
import { jwtDecode } from 'jwt-decode';

export const getTokenExpirationDate = (token) => {
  try {
    const decoded = jwtDecode(token);
    const expirationDate = new Date(decoded.exp * 1000); 
    return expirationDate;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null; 
  }
};