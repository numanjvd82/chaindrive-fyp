import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HowItWork from "../components/HowItWork";
import MainSearch from "../components/MainSearch";
import Navbar from "../components/Navbar";
import PopularRenterDeals from "../components/PopularRenterDeals";
import WhyChooseUs from "../components/WhyChooseUs";

const handleSearch = (location: string, pickupDate: string, returnDate: string) => {
  console.log("Search Details:", { location, pickupDate, returnDate });
};


export default function Home() {
  // const { user } = useUser();

  // if (!user) {
  //   return (
  //     <h1 className="text-red-600 text-9xl text-[100px]">
  //       You are not logged in
  //     </h1>
  //   );
  // }

  return (
    <div>

    <Navbar />,
    <HeroSection />
    <MainSearch onSearch={handleSearch}/>
    <HowItWork />
    <WhyChooseUs />
    <PopularRenterDeals />
    <Footer />

      {/* <LogoutButton /> */}

      {/* <p>{user.role === "owner" ? "You are an owner" : "You are a renter"}</p> */}
    </div>
  );
}
