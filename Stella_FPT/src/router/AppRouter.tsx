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
import ManageUser from "../pages/admin/ManageUser";
import ManageMajor from "../pages/admin/ManageMajor";
import ManageProgram from "../pages/admin/ManageProgram";
import ManageCurriculum from "../pages/admin/ManageCurriculum";
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
            <Route
              path="/manageStudent"
              element={
                <PrivateRoute element={ManageUser} allowedRoles={["Admin"]} />
              }
            />
            <Route
              path="/manageCurriculum"
              element={
                <PrivateRoute
                  element={ManageCurriculum}
                  allowedRoles={["Admin"]}
                />
              }
            />
            <Route
              path="/manageMajor"
              element={
                <PrivateRoute element={ManageMajor} allowedRoles={["Admin"]} />
              }
            />
            <Route
              path="/manageProgram"
              element={
                <PrivateRoute
                  element={ManageProgram}
                  allowedRoles={["Admin"]}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
