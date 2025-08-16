import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";

export const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchAdminProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://hotel-server-side-beta.vercel.app/admin/profile/${user.email}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch admin profile");
        }
        const data = await res.json();
        setAdminData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [user?.email]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-8 border-t-8 border-gray-200 border-t-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto p-6 bg-red-100 text-red-700 rounded-md mt-6 shadow">
        <p>Error: {error}</p>
      </div>
    );

  if (!adminData) return null;

  return (
    <div className="max-w-md mx-auto bg-neutralBg shadow-lg rounded-xl p-6 mt-8 sm:p-8">
      <div className="flex flex-col items-center text-center px-4">
        <img
          src={adminData.image || user.photoURL || "https://via.placeholder.com/150"}
          alt={adminData.name || user.displayName || "Admin"}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mb-6 border-4 border-primary shadow-md"
        />
        <h2 className="text-2xl sm:text-3xl font-bold text-darkText mb-2 truncate max-w-full">
          {adminData.name || user.displayName}
        </h2>
        <p className="text-darkText/70 mb-4 truncate max-w-full">{adminData.email || user.email}</p>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold text-base sm:text-lg whitespace-nowrap shadow-sm">
          Meals Added: {adminData.mealsAddedCount ?? 0}
        </div>
      </div>
    </div>
  );
};
