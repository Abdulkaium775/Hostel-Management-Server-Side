import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";
import axiosInstance from "../Api/axios"; // your configured axios

const MyProfile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser?.email) {
      axiosInstance.get(`/users/${authUser.email}`)
        .then(res => setUser(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [authUser]);

  if (loading) return <p className="text-center mt-10 text-darkText/70 font-medium">Loading user info...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500 font-medium">User not found</p>;

  const badgeLabel = user.badge || "Bronze";
  const badgeClass = {
    Bronze: "bg-orange-500",
    Silver: "bg-gray-400",
    Gold: "bg-yellow-500",
    Platinum: "bg-purple-700"
  }[badgeLabel] || "bg-orange-500";

  return (
    <div className="p-5 max-w-3xl mx-auto space-y-6 bg-neutralBg min-h-screen">
      <h2 className="text-3xl font-bold text-darkText text-center md:text-left">My Profile</h2>

      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-start md:gap-8 transition hover:shadow-2xl">
        <img
          src={user.photoURL || "https://via.placeholder.com/96"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-primary mb-4 md:mb-0"
        />

        <div className="text-center md:text-left space-y-2">
          <h3 className="text-2xl font-semibold text-darkText">{user.displayName || "No Name"}</h3>
          <p className="text-darkText/70">{user.email || "No Email"}</p>
          <p className="text-darkText/70">{user.phoneNumber || "No Phone"}</p>
          <p className="text-darkText/70">{user.address || "No Address"}</p>
          <p className="text-darkText/70">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>

          <span className={`inline-block px-5 py-1 rounded-full text-white font-semibold ${badgeClass} text-sm`}>
            {badgeLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
