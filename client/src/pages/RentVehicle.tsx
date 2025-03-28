import AboutVehicleOwner from "@/components/AboutVehicleOwner";
import Footer from "@/components/Footer";
import BookingCalculator from "@/components/pages/RenterDashboard/BookingCalculator";
import CarDetail from "@/components/pages/RenterDashboard/CarDetail";
import Recommendation from "@/components/Recommendation";

const RentVehicle = () => {

  return (
    <div>
    <div className=" bg-gray-100 p-8">

        <div className="flex m-6 ">
      <CarDetail/>
      <BookingCalculator ppd={110}/>
      
      </div>
      <AboutVehicleOwner name={""} business={""} rating={0} reviewCount={0} country={""} memberSince={""} description={""}  />
   <Recommendation/> 
    </div>
        <Footer/>
    </div>
    
  );
};

export default RentVehicle;
