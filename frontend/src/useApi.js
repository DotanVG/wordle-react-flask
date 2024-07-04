import { useState, useCallback } from 'react';
import axios from 'axios';

const urls = [
  import.meta.env.VITE_BACKEND_URL,
  import.meta.env.VITE_BACKEND_URL_BACKUP_1,
  import.meta.env.VITE_BACKEND_URL_BACKUP_2,
  import.meta.env.VITE_BACKEND_URL_BACKUP_3,
];

const useApi = () => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  const apiCall = useCallback(
    async (method, endpoint, data = null) => {
      for (let i = 0; i < urls.length; i++) {
        const index = (currentUrlIndex + i) % urls.length;
        try {
          const response = await axios({
            method,
            url: `${urls[index]}${endpoint}`,
            data,
          });
          setCurrentUrlIndex(index);
          return response.data;
        } catch (error) {
          console.error(`Error with URL ${urls[index]}:`, error);
          if (i === urls.length - 1) {
            throw error;
          }
        }
      }
    },
    [currentUrlIndex]
  );

  return apiCall;
};

export default useApi;
