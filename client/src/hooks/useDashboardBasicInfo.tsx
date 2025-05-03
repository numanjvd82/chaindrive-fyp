import { axiosInstance } from "@/lib/axios";
import { useQuery } from "react-query";

interface DashboardBasicInfo {
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  totalListings: number;
}

async function fetchDashboardBasicInfo() {
  try {
    const { data } = await axiosInstance.get<DashboardBasicInfo>(
      "/api/dashboard/basic-info"
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch dashboard data"
    );
  }
}

export function useDashboardBasicInfo() {
  const { data, error, isLoading, refetch } = useQuery<DashboardBasicInfo>(
    "dashboardBasicInfo",
    fetchDashboardBasicInfo
  );

  return {
    dashboardBasicInfo: data,
    error,
    isLoading,
    refetch,
  };
}
