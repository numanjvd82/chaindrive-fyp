import { LogoutButton } from "../components/LogoutButton";
import Splash from "../components/Splash";
import useUser from "../hooks/useUser";

const OwnerProfile = () => {
  const { user } = useUser();

  if (!user) return <Splash />;

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {user.role === "owner" && <p>Owner-specific content here...</p>}

      <a href="/renter-profile">Renter Profile</a>

      <LogoutButton />
    </div>
  );
};

export default OwnerProfile;
