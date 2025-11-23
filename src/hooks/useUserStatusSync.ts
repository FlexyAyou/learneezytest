import { useCallback, useEffect, useState } from 'react';

export type UserStatus = 'active' | 'inactive' | 'suspended' | string;

interface UseUserStatusSyncOptions {
  initialStatus: UserStatus;
  onStatusChanged?: (status: UserStatus) => void;
}

export const useUserStatusSync = ({
  initialStatus,
  onStatusChanged,
}: UseUserStatusSyncOptions) => {
  const [userStatus, setUserStatus] = useState<UserStatus>(initialStatus);

  useEffect(() => {
    setUserStatus(initialStatus);
  }, [initialStatus]);

  const handleStatusChanged = useCallback(
    (status: UserStatus) => {
      setUserStatus(status);
      onStatusChanged?.(status);
    },
    [onStatusChanged]
  );

  return {
    userStatus,
    setUserStatus,
    handleStatusChanged,
  };
};
