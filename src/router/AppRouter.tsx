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
import CurriculumDetail from "../pages/admin/CurriculumDetail";
import AddCurriculum from "../pages/admin/AddCurriculum";
import EditCurriculum from "../pages/admin/EditCurriculum";
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
              path="/manageCurriculum/:curriculumId/"
              element={
                <PrivateRoute
                  element={CurriculumDetail}
                  allowedRoles={["Admin"]}
                />
              }
            />
            <Route
              path="/manageCurriculum/AddCurriculum"
              element={
                <PrivateRoute
                  element={AddCurriculum}
                  allowedRoles={["Admin"]}
                />
              }
            />
            <Route
              path="/manageCurriculum/UpdateCurriculum/:curriculumId/"
              element={
                <PrivateRoute
                  element={EditCurriculum}
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
