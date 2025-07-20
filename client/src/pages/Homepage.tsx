import Footer from "@/components/Footer";
import Header from "@/components/pages/Homepage/Header";
import HeroSection from "@/components/pages/Homepage/HeroSection";
import HowItWork from "@/components/pages/Homepage/HowItWork";
import MainSearch from "@/components/pages/Homepage/MainSearch";
import PopularRenterDeals from "@/components/pages/Homepage/PopularRenterDeals";
import WhyChooseUs from "@/components/pages/Homepage/WhyChooseUs";

const handleSearch = () => {};

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
      <Header />,
      <HeroSection />
      <MainSearch onSearch={handleSearch} />
      <HowItWork />
      <WhyChooseUs />
      <PopularRenterDeals />
      <Footer />
      {/* <LogoutButton /> */}
      {/* <p>{user.role === "owner" ? "You are an owner" : "You are a renter"}</p> */}
    </div>
  );
}
