import { createQuery } from '@tanstack/svelte-query';
import type { User } from 'better-auth';

type UseUserDashboardParams = {
	initialData?: GetUserDashboardResult;
	user?: User;
};

export function useUserDashboard({ initialData, user }: UseUserDashboardParams = {}) {
	return createQuery(() => ({
		queryKey: ['user-dashboard', user?.id],
		queryFn: async () => {
			const res = await fetch('/api/dashboard');
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			return json.data as GetUserDashboardResult;
		},
		enabled: !!user,
		initialData,
		staleTime: 1000 * 60 * 5 // 5 minutes
	}));
}

