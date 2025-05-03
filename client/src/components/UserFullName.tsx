import Loader from "@/components/Loader";
import { useOtherUser } from "@/hooks/useOtherUser";
import React from "react";

interface UserFullNameProps {
  userId: number;
}

const UserFullName: React.FC<UserFullNameProps> = ({ userId }) => {
  const { user, isLoading, error } = useOtherUser(userId);

  if (isLoading) {
    return <Loader size="sm" />;
  }

  if (error || !user) {
    return <span className="text-red-500">User not found</span>;
  }

  return <span>{`${user.firstName} ${user.lastName}`}</span>;
};

export default UserFullName;
