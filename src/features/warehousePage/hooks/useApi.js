import { useState } from "react";
import { apiRequest, handleApiError } from "../utils/apiUtils";

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (requestFn) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const get = (endpoint) => execute(() => apiRequest(endpoint));
  
  const post = (endpoint, data) => execute(() => 
    apiRequest(endpoint, {
      method: "POST",
      body: data
    })
  );

  const put = (endpoint, data) => execute(() =>
    apiRequest(endpoint, {
      method: "PUT", 
      body: data
    })
  );

  const del = (endpoint) => execute(() =>
    apiRequest(endpoint, { method: "DELETE" })
  );

  return {
    isLoading,
    error,
    setError,
    get,
    post,
    put,
    del
  };
};