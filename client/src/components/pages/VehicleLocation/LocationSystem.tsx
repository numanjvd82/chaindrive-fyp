import Button from "@/components/Button";
import Footer from "@/components/Footer";

import Splash from "@/components/Splash";
import { useUser } from "@/hooks/useUser";


const LocationSystem: React.FC = () => {
    const { user, loading } = useUser();


    if (loading) {
        return <Splash />;
    }

    if (!user) {
        return null;
    }

    return (


        <div className="bg-gray-100 font-sans">
            <div className="p-4 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold">Vehicle tracking</h2>
                <p className="text-sm mb-4 mt-2">
                    Real-time location of your vehicles.
                </p>

                <img src="/dummylocation.svg"></img>

                <h3 className="py-6 text-lg font-bold">List of vehicles</h3>
                <div className="flex justify-end">
                    <Button className="mt-4">Confirmed by {user.role}</Button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LocationSystem;
