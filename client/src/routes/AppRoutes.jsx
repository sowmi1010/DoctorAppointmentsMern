import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DoctorList from "../pages/patient/DoctorList";
import DoctorDetails from "../pages/patient/DoctorDetails";
import Unauthorized from "../pages/common/Unauthorized";
import NotFound from "../pages/common/NotFound";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import MyAppointments from "../pages/patient/MyAppointments";
import AdminDashboard from "../pages/admin/AdminDashboard";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/doctors" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient pages */}
      <Route
        path="/doctors"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["PATIENT", "ADMIN", "DOCTOR"]}>
              <DoctorList />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/doctors/:id"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["PATIENT", "ADMIN", "DOCTOR"]}>
              <DoctorDetails />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      {/* Patient: My Appointments */}
      <Route
        path="/patient/appointments"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["PATIENT"]}>
              <MyAppointments />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Doctor: Dashboard */}
      <Route
        path="/doctor/dashboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Admin: Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
