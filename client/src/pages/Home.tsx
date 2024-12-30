import { LogoutButton } from "../components/LogoutButton";
import { useUser } from "../hooks/useUser";

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return (
      <h1 className="text-red-600 text-9xl text-[100px]">
        You are not logged in
      </h1>
    );
  }

  return (
    <div>
      <h1 className="text-red-600 text-9xl text-[100px]">
        This is a home page
      </h1>

      <LogoutButton />

      <p>{user.role === "owner" ? "You are an owner" : "You are a renter"}</p>
    </div>
  );
}
