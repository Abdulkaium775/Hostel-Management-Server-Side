import { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";

export const MyProfile = () => {
  const { user } = useContext(AuthContext); // use your Auth Context
  return (
    <div>
      <h2 className="text-2xl font-bold">My Profile</h2>
      <p>Name: {user.displayName}</p>
      <p>Email: {user.email}</p>
      <p>Badge: Bronze (Default)</p>
    </div>
  );
};
