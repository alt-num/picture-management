import { useState, useCallback } from 'react';
import { Remark, NewRemark } from '@/types/remark';

const API_BASE_URL = '/api';

export function useRemarks(profileId: string) {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRemarks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/remarks/${profileId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch remarks');
      }
      const data = await response.json();
      setRemarks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch remarks');
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  const addRemark = useCallback(async (newRemark: NewRemark) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/remarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRemark),
      });

      if (!response.ok) {
        throw new Error('Failed to add remark');
      }

      const addedRemark = await response.json();
      setRemarks(prev => [addedRemark, ...prev]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add remark');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    remarks,
    loading,
    error,
    fetchRemarks,
    addRemark,
  };
}
