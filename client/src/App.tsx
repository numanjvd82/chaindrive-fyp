import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import OwnerProfile from "./pages/OwnerProfile";
import ProtectedRoute from "./pages/ProtectedRoute";
import RenterProfile from "./pages/RenterProfile";
import RoleProtectedRoute from "./pages/RoleProtectedRoute";
import SignUp from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/renter-profile"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["renter"]}>
                <RenterProfile />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/owner-profile"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["owner"]}>
                <OwnerProfile />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
