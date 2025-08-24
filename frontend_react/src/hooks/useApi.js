import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(!!endpoint);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);
    api.get(endpoint)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
