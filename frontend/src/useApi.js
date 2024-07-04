import { useState, useCallback } from 'react';
import axios from 'axios';

const url =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_LOCAL_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL;

const useApi = () => {
  const [currentUrl, setCurrentUrl] = useState(url);

  const apiCall = useCallback(
    async (method, endpoint, data = null) => {
      try {
        const response = await axios({
          method,
          url: `${currentUrl}${endpoint}`,
          data,
        });
        return response.data;
      } catch (error) {
        console.error(`Error with URL ${currentUrl}:`, error);
        throw error;
      }
    },
    [currentUrl]
  );

  return apiCall;
};

export default useApi;
