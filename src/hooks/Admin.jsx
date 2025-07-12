import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";


const useAdmin = () => {
  const { user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    // Example: fetch admin status from your server or check locally
    fetch(`/api/admins/${user.email}`)
      .then(res => res.json())
      .then(data => setIsAdmin(data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, [user]);

  return [isAdmin];
};

export default useAdmin;
