import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Splash from "./components/Splash";
import useUser from "./hooks/useUser";

const LoginPage = React.lazy(() => import("./pages/Login"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));
const NotAuthorizedPage = React.lazy(() => import("./pages/NotAuthorized"));
const OwnerProfilePage = React.lazy(() => import("./pages/OwnerProfile"));
const RenterProfilePage = React.lazy(() => import("./pages/RenterProfile"));
const SignupPage = React.lazy(() => import("./pages/Signup"));

const ROUTES = [
  {
    link: "/",
    component: <div>Home</div>,
  },
  {
    link: "/renter-profile",
    component: <RenterProfilePage />,
    roles: ["renter"],
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
    link: "/owner-profile",
    component: <OwnerProfilePage />,
    roles: ["owner"],
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
      navigate("/login");
    }

    if (!loading && user) {
      const currentRoute = ROUTES.find(
        (route) => route.link === location.pathname
      );
      if (currentRoute?.roles && !currentRoute.roles.includes(user.role)) {
        navigate("/not-authorized");
      }
    }
  }, [loading, user, navigate, location.pathname]);

  if (loading) {
    return <Splash />;
  }

  return (
    <Suspense fallback={<Splash />}>
      <ToastContainer />

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
