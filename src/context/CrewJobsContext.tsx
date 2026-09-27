import { useFocusEffect } from 'expo-router';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { CREW_PERFORMANCE, type CrewNotification, type CrewSurprise, type CrewTask } from '@/data/crewTasks';
import { TEST_CREW_ACCOUNT } from '@/data/mockUsers';
import { useAuth } from '@/context/AuthContext';
import { crewService, type CrewAssignment } from '@/services/crewService';
import {
  assignmentToNotification,
  assignmentToSurprise,
  assignmentToTask,
  countTaskStats,
  splitTasks,
} from '@/services/crewJobs';
import { isApprovedCrew } from '@/types/auth';

type CrewJobsValue = {
  assignments: CrewAssignment[];
  surprises: CrewSurprise[];
  tasks: CrewTask[];
  todayTasks: CrewTask[];
  upcomingTasks: CrewTask[];
  completedTasks: CrewTask[];
  notifications: CrewNotification[];
  stats: ReturnType<typeof countTaskStats>;
  performance: typeof CREW_PERFORMANCE;
  isHydrated: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
};

const CrewJobsContext = createContext<CrewJobsValue | null>(null);

export function CrewJobsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<CrewAssignment[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (!isApprovedCrew(user)) {
      setAssignments([]);
      setIsHydrated(true);
      return;
    }

    setRefreshing(true);
    try {
      const items = await crewService.listAssigned();
      setAssignments(items);
    } catch {
      setAssignments([]);
    } finally {
      setIsHydrated(true);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const value = useMemo(() => {
    const tasks = assignments.map(assignmentToTask);
    const split = splitTasks(tasks);
    const completed = assignments.filter((item) => item.status === 'completed').length;
    return {
      assignments,
      surprises: assignments.map(assignmentToSurprise),
      tasks,
      ...split,
      notifications: assignments.map(assignmentToNotification),
      stats: countTaskStats(tasks),
      performance: {
        ...CREW_PERFORMANCE,
        totalJobs: assignments.length,
        completed,
        city: user?.city ?? TEST_CREW_ACCOUNT.city,
        crewId: user?.id ? `CRW-${user.id.slice(-5).toUpperCase()}` : CREW_PERFORMANCE.crewId,
      },
      isHydrated,
      refreshing,
      refresh,
    };
  }, [assignments, isHydrated, refresh, refreshing, user]);

  return <CrewJobsContext.Provider value={value}>{children}</CrewJobsContext.Provider>;
}

export function useCrewJobs(): CrewJobsValue {
  const context = useContext(CrewJobsContext);
  if (!context) {
    throw new Error('useCrewJobs must be used within CrewJobsProvider.');
  }
  return context;
}
