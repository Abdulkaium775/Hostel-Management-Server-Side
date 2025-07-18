import { useContext, useEffect, useState } from "react";
import axiosInstance from "../Api/axios";
import { AuthContext } from "../Auth/AuthContext";

const useAdmin = () => {
  const { user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/api/users/admin/${user.email}`);
        if (isMounted) {
          setIsAdmin(response.data?.isAdmin || false);
        }
      } catch (error) {
        console.error("❌ Error checking admin status:", error);
        if (isMounted) setIsAdmin(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return [isAdmin, loading];
};

export default useAdmin;
