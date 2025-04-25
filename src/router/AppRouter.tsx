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
import Curriculum from "../pages/students/Curriculum";
import Syllabus from "../pages/students/Syllabus";
import Profile from "../pages/students/Profile";
import Dashboard from "../pages/admin/Dashboard";
import ManageUser from "../pages/admin/ManageUser";
import ManageMajor from "../pages/admin/ManageMajor";
import ManageProgram from "../pages/admin/ManageProgram";
import ManageCurriculum from "../pages/admin/ManageCurriculum";
import CurriculumDetail from "../pages/admin/CurriculumDetail";
import AddCurriculum from "../pages/admin/AddCurriculum";
import EditCurriculum from "../pages/admin/EditCurriculum";
import PLO from "../pages/admin/PLO";
import PO from "../pages/admin/PO";
import DetailPO from "../pages/admin/DetailPO";
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
              path="/profile"
              element={
                <PrivateRoute element={Profile} allowedRoles={["Student"]} />
              }
            />
            <Route
              path="/curriculum"
              element={
                <PrivateRoute element={Curriculum} allowedRoles={["Student"]} />
              }
            />
            <Route
              path="/Syllabus"
              element={
                <PrivateRoute element={Syllabus} allowedRoles={["Student"]} />
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
            <Route
              path="/ProgramLearningOutcomes"
              element={<PrivateRoute element={PLO} allowedRoles={["Admin"]} />}
            />
            <Route
              path="/ProgramOutcomes"
              element={<PrivateRoute element={PO} allowedRoles={["Admin"]} />}
            />
            <Route
              path="/ProgramOutcomes/DetailPO/:poId"
              element={
                <PrivateRoute element={DetailPO} allowedRoles={["Admin"]} />
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
