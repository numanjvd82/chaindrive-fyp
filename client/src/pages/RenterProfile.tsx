import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SearchBar from "../components/renterDashboard/SearchBar";
import SearchData from "../components/renterDashboard/SearchData";

const handleSearch2 = (filters: Record<string, string>) => {
  console.log("Search filters:", filters);
  // Perform search or API call with filters
};

const RenterProfile = () => {
  // const { user } = useUser();

  // if (!user) return <Splash />;

  return (
    <div>
      {/* <h1>Welcome, {user.first_name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {user.role === "renter" && <p>Renter-specific content here...</p>} */}

      {/* <a href="/owner-profile">Owner Profile</a> */}
      {/* <LogoutButton /> */}

    <Navbar />
    <SearchBar onSearch={handleSearch2}/>
    <SearchData />
    <Footer />
    </div>
  );
};

export default RenterProfile;
