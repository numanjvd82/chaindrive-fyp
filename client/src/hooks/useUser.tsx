import { useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../lib/axios";
import { User } from "../lib/types";
import { periodicUserFetchTime } from "../lib/utils";

const fetchUser = async () => {
  const { data } = await axiosInstance.get<User>("/api/auth/me", {
    withCredentials: true,
  });
  return data;
};

export const useUser = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: loading,
    refetch,
  } = useQuery<User | null>(
    "user",
    async () => {
      try {
        return await fetchUser();
      } catch (err: any) {
        if (err.response?.status === 401) {
          queryClient.setQueryData("user", null);
        }
        return null;
      }
    },
    {
      refetchInterval: periodicUserFetchTime, // Periodically refetch every 5 minutes
      refetchOnWindowFocus: true,
    }
  );

  return { user, loading, refetch };
};
