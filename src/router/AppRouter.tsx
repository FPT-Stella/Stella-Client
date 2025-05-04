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
import CurriculumDetailStudent from "../pages/students/CurriculumDetailStudent";
import AddCurriculum from "../pages/admin/AddCurriculum";
import EditCurriculum from "../pages/admin/EditCurriculum";
import Subject from "../pages/admin/Subject";
import PO from "../components/Admin/PO";
import POStudent from "../pages/students/POStudent";
import DetailPO from "../pages/admin/DetailPO";
import SubjectDetail from "../pages/admin/SubjectDetail";
import GoogleCallback from "../pages/Authentication/GoogleCallback";
import ProgramDetail from "../pages/admin/ProgramDetail";
import ComboSubjectDetail from "../pages/admin/ComboSubjectDetail";
import AddSubject from "../pages/admin/AddSubject";
import EditSubject from "../pages/admin/EditSubject";
import Tool from "../pages/admin/Tool";
import SyllabusDetails from "../pages/students/SyllabusDetails";
import ToolDetail from "../pages/admin/ToolDetail";
function AppRouter() {
  return (
    <div>
      <Router>
        <Routes>
          {/* không có layoutlayout */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/google/callback" element={<GoogleCallback />} />

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
                <PrivateRoute
                  element={Curriculum}
                  allowedRoles={["Student"]}
                  requiresProfile={true}
                />
              }
            />

            <Route
              path="/curriculum/:curriculumId/"
              element={
                <PrivateRoute
                  element={CurriculumDetailStudent}
                  allowedRoles={["Student"]}
                  requiresProfile={true}
                />
              }
            />
            <Route
              path="/Syllabus"
              element={
                <PrivateRoute
                  element={Syllabus}
                  allowedRoles={["Student"]}
                  requiresProfile={true}
                />
              }
            />
            <Route
              path="/Syllabus/:subjectId"
              element={
                <PrivateRoute
                  element={SyllabusDetails}
                  allowedRoles={["Student"]}
                />
              }
            />

            <Route
              path="/program/:programId/curriculum/:curriculumId/outcomes"
              element={<POStudent />}
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
              path="/manageSubject"
              element={
                <PrivateRoute element={Subject} allowedRoles={["Admin"]} />
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
              path="/manageTool"
              element={<PrivateRoute element={Tool} allowedRoles={["Admin"]} />}
            />
            <Route
              path="/manageTool/:toolId/"
              element={
                <PrivateRoute element={ToolDetail} allowedRoles={["Admin"]} />
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
              path="/manageSubject/:subjectId/"
              element={
                <PrivateRoute
                  element={SubjectDetail}
                  allowedRoles={["Admin"]}
                />
              }
            />
            <Route
              path="/manageSubject/update/:subjectId"
              element={
                <PrivateRoute element={EditSubject} allowedRoles={["Admin"]} />
              }
            />
            <Route
              path="/manageSubject/AddSubject"
              element={
                <PrivateRoute element={AddSubject} allowedRoles={["Admin"]} />
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
              path="/manageProgram/:programId"
              element={
                <PrivateRoute
                  element={ProgramDetail}
                  allowedRoles={["Admin"]}
                />
              }
            />
            <Route
              path="/manageProgram/:programId/combo/:combosubjectId"
              element={
                <PrivateRoute
                  element={ComboSubjectDetail}
                  allowedRoles={["Admin"]}
                />
              }
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
