import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Splash from "./components/Splash";
import useUser from "./hooks/useUser";

const LoginPage = React.lazy(() => import("./pages/Login"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));
const NotAuthorizedPage = React.lazy(() => import("./pages/NotAuthorized"));
const OwnerDashboardPage = React.lazy(() => import("./pages/OwnerDashboard"));
const RenterDashboardPage = React.lazy(() => import("./pages/RenterDashboard"));
const SignupPage = React.lazy(() => import("./pages/Signup"));
const ProfilePage = React.lazy(() => import("./pages/Profile"));
const HomePage = React.lazy(() => import("./pages/Homepage"));
const Chat = React.lazy(() => import("./pages/Chat"));

const DummyContract = React.lazy(() => import("./pages/DummyContract"));

const CreateListing = React.lazy(() => import("./pages/CreateListing"));

const ROUTES = [
  {
    link: "/",
    component: <HomePage />,
  },
  {
    link: "/dummy-contract",
    component: <DummyContract />,
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
    link: "/renter-dashboard",
    component: <RenterDashboardPage />,
    roles: ["renter"],
  },
  {
    link: "/owner-dashboard",
    component: <OwnerDashboardPage />,
    roles: ["owner"],
  },
  {
    link: "/listings/create",
    component: <CreateListing />,
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

  const noRedirectPaths = ["/login", "/signup", "/not-authorized"];

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
      if (location.pathname === "/") {
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
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />

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
