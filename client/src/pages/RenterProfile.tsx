import { LogoutButton } from "../components/LogoutButton";
import { useUser } from "../hooks/useUser";

const RenterProfile = () => {
  const { user } = useUser();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.first_name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {user.role === "renter" && <p>Renter-specific content here...</p>}

      <a href="/owner-profile">Owner Profile</a>

      <LogoutButton />
    </div>
  );
};

export default RenterProfile;
