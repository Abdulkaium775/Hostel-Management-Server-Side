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
        const res = await fetch(`http://localhost:5000/admin/profile/${user.email}`);
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
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
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
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 mt-8">
      <div className="flex flex-col items-center">
        <img
          src={adminData.image || user.photoURL || "https://via.placeholder.com/150"}
          alt={adminData.name || user.displayName || "Admin"}
          className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-indigo-500 shadow-md"
        />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{adminData.name || user.displayName}</h2>
        <p className="text-gray-600 mb-4">{adminData.email || user.email}</p>
        <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold text-lg">
          Meals Added: {adminData.mealsAddedCount ?? 0}
        </div>
      </div>
    </div>
  );
};
