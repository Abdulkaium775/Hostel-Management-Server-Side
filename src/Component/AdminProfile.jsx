import { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";

export const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h2 className="text-2xl font-bold">Admin Profile</h2>
      <p>Name: {user.displayName}</p>
      <p>Email: {user.email}</p>
      <p>Total Meals Added: [You can fetch this from backend]</p>
    </div>
  );
};
