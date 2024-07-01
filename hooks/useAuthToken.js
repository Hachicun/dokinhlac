// hooks/useAuthToken.js
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

export const useAuthToken = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
      }
    };

    fetchToken();
  }, []);

  return token;
};
