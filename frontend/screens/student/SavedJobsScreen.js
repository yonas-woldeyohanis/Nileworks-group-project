import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/common/Header';
import JobCard from '../../components/common/JobCard';
import { JobCardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';

const SavedJobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get(ENDPOINTS.JOBS.SAVED);
      setJobs(res.data.data.jobs || []);
    } catch (err) {
      console.error('Fetch saved jobs error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSavedJobs();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSavedJobs();
  };

  const handleSave = async (job) => {
    try {
      if (job.isSaved) {
        await api.delete(ENDPOINTS.JOBS.UNSAVE(job._id));
        setJobs((prev) => prev.filter((j) => j._id !== job._id));
      } else {
        await api.post(ENDPOINTS.JOBS.SAVE(job._id));
      }
    } catch (err) {
      console.error('Save job error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Saved Posts" />
      <FlatList
        data={loading ? [] : jobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: SPACING.base }}>
            <JobCard
              job={item}
              index={index}
              onPress={(job) => navigation.navigate('JobDetail', { jobId: job._id })}
              onSave={handleSave}
            />
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletons}>
              {[1, 2, 3].map((i) => <JobCardSkeleton key={i} />)}
            </View>
          ) : (
            <View style={{ paddingHorizontal: SPACING.base }}>
              <EmptyState
                icon="bookmark-outline"
                title="No saved posts"
                message="Jobs you save will appear here."
              />
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingBottom: 90, paddingTop: SPACING.sm },
  skeletons: { paddingHorizontal: SPACING.base },
});

export default SavedJobsScreen;
