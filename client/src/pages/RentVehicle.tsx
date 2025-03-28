import Footer from "@/components/Footer";
import BookingCalculator from "@/components/pages/RenterDashboard/BookingCalculator";
import CarDetail from "@/components/pages/RenterDashboard/CarDetail";

const RentVehicle = () => {
  return (
    <div>
        <div className=" bg-gray-100 p-8 flex justify-evenly">
      <CarDetail  />
      <BookingCalculator ppd={110}/>
      
    </div>
        <Footer/>
    </div>
    
  );
};

export default RentVehicle;
