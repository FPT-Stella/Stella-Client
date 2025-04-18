import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./PriveRouter";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutStudent from "../layouts/LayoutStudent";
import Login from "../pages/Authentication/Login";
import HomePage from "../pages/students/HomePage";
import Dashboard from "../pages/admin/Dashboard";
function AppRouter() {
  return (
    <div>
      <Router>
        <Routes>
          {/* không có layoutlayout */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          {/* STUDENT */}
          <Route element={<LayoutStudent />}>
            <Route
              path="/home"
              element={
                <PrivateRoute element={HomePage} allowedRoles={["Student"]} />
              }
            />
          </Route>

          {/* ADMIN */}

          <Route element={<LayoutAdmin />}>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute element={Dashboard} allowedRoles={["Admin"]} />
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
