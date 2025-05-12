import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Splash from "./components/Splash";
import { useUser } from "./hooks/useUser";
import RentVehicle from "./pages/RentVehicle";
import ActiveRentalData from "./components/pages/OwnerDashboard/ActiveRentalData";

const LoginPage = React.lazy(() => import("./pages/Login"));
const OTPInputPage = React.lazy(() => import("./pages/OtpInput"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));
const NotAuthorizedPage = React.lazy(() => import("./pages/NotAuthorized"));
const OwnerDashboardPage = React.lazy(() => import("./pages/OwnerDashboard"));
const RenterDashboardPage = React.lazy(() => import("./pages/RenterDashboard"));
const SignupPage = React.lazy(() => import("./pages/Signup"));
const ProfilePage = React.lazy(() => import("./pages/Profile"));
const HomePage = React.lazy(() => import("./pages/Homepage"));
const Chat = React.lazy(() => import("./pages/Chat"));
const ListingsPage = React.lazy(() => import("./pages/Listings"));
const CreateListing = React.lazy(() => import("./pages/CreateListing"));
const ListingDetails = React.lazy(() => import("./pages/ListingDetails"));
const RentalConfirmation = React.lazy(
  () => import("./pages/RentalConfirmation")
);
const RentalSuccessful = React.lazy(() => import("./pages/RentalSuccessful"));
const RentalsPage = React.lazy(() => import("./pages/Rentals"));
const ActiveRentalDetail = React.lazy(
  () => import("./pages/ActiveRentalDetail")
);
const DevicesPage = React.lazy(() => import("./pages/Devices"));

const ROUTES: {
  link: string;
  component: React.ReactNode;
  roles?: string[];
}[] = [
  {
    link: "/",
    component: <HomePage />,
  },
  {
    link: "/signup",
    component: <SignupPage />,
  },
  {
    link: "/login",
    component: <LoginPage />,
  },
  {
    link: "/otp-input",
    component: <OTPInputPage />,
  },
  {
    link: "/renter-dashboard",
    component: <RenterDashboardPage />,
    roles: ["renter"],
  },
  {
    link: "/listing-detail/:id",
    component: <ListingDetails />,
    roles: ["renter"],
  },
  {
    link: "/rental-confirmation/:id",
    component: <RentalConfirmation />,
    roles: ["renter"],
  },
  {
    link: "/rental-successful/:id",
    component: <RentalSuccessful />,
    roles: ["renter"],
  },
  {
    link: "/owner-dashboard",
    component: <OwnerDashboardPage />,
    roles: ["owner"],
  },
  {
    link: "/rentals",
    component: <RentalsPage />,
    roles: ["owner", "renter"],
  },
  {
    link: "/rentals/:id",
    component: <ActiveRentalDetail />,
    roles: ["owner", "renter"],
  },
  {
    link: "/listings/create",
    component: <CreateListing />,
    roles: ["owner"],
  },
  {
    link: "/listings",
    component: <ListingsPage />,
    roles: ["owner"],
  },
  {
    link: "/devices",
    component: <DevicesPage />,
    roles: ["owner"],
  },
  {
    link: "/profile",
    component: <ProfilePage />,
    roles: ["owner", "renter"],
  },
  {
    link: "/chat",
    component: <Chat />,
    roles: ["owner", "renter"],
  },
  {
    link: "/not-authorized",
    component: <NotAuthorizedPage />,
  },
];

const MainApp: React.FC = () => {
  const { user, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const noRedirectPaths = [
    "/login",
    "/signup",
    "/not-authorized",
    "/otp-input",
  ];

  useEffect(() => {
    if (!loading && !user && !noRedirectPaths.includes(location.pathname)) {
      if (location.pathname === "/") {
        return;
      }
      navigate("/login");
    }

    if (!loading && user) {
      const currentRoute = ROUTES.find(
        (route) => route.link === location.pathname
      );
      if (location.pathname === "/" || location.pathname === "/otp-input") {
        navigate(
          user.role === "owner" ? "/owner-dashboard" : "/renter-dashboard"
        );
      }
      if (currentRoute?.roles && !currentRoute.roles.includes(user.role)) {
        navigate("/not-authorized");
      }
    }
  }, [loading, user, location.pathname]);

  if (loading) {
    return <Splash />;
  }

  return (
    <Suspense fallback={<Splash />}>
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        autoClose={3000}
      />

      <Header />
      <Routes>
        {ROUTES.map(({ component, link }) => (
          <Route key={link} path={link} element={component} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default MainApp;
