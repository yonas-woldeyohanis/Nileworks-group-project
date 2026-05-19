import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../constants/endpoints';

// ─── useJobs ─────────────────────────────────────────────────────────────────
export const useJobs = (filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (pageNum = 1, append = false) => {
    try {
      setError(null);
      const params = { page: pageNum, limit: 10, ...filters };
      const res = await api.get(ENDPOINTS.JOBS.LIST, { params });
      const newJobs = res.data.data.jobs;
      setJobs(append ? (prev) => [...prev, ...newJobs] : newJobs);
      setHasMore(res.data.data.hasMore);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchJobs(1, false);
  }, [fetchJobs]);

  const refresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchJobs(1, false);
  };

  const loadMore = () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchJobs(next, true);
  };

  const toggleSave = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await api.delete(ENDPOINTS.JOBS.UNSAVE(jobId));
      } else {
        await api.post(ENDPOINTS.JOBS.SAVE(jobId));
      }
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, isSaved: !isSaved } : j))
      );
    } catch (err) {
      console.error('Toggle save error:', err);
    }
  };

  return { jobs, loading, refreshing, hasMore, error, refresh, loadMore, toggleSave, setJobs };
};

// ─── useApplications ─────────────────────────────────────────────────────────
export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get(ENDPOINTS.APPLICATIONS.MY_APPLICATIONS);
      setApplications(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, []);

  const refresh = () => { setRefreshing(true); fetchApplications(); };

  const updateStatus = (applicationId, newStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a._id === applicationId ? { ...a, status: newStatus } : a))
    );
  };

  const counts = {
    total: applications.length,
    applied: applications.filter((a) => a.status === 'applied').length,
    viewed: applications.filter((a) => a.status === 'viewed').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    offered: applications.filter((a) => a.status === 'offered').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return { applications, loading, refreshing, error, refresh, updateStatus, counts };
};
