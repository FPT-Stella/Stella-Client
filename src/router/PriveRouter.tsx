import React from "react";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PrivateRouteProps {
  element: React.ComponentType;
  allowedRoles: string[];
  requiresProfile?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element: Component,
  allowedRoles,
  requiresProfile = false,
}) => {
  const userData = localStorage.getItem("userData");
  const isProfileCompleted =
    localStorage.getItem("profileCompleted") === "true";

  if (!userData) {
    return <Navigate to="/login" />;
  }

  const { role } = JSON.parse(userData);

  // Check role first
  if (!allowedRoles.includes(role)) {
    toast.error("Unauthorized access");
    return <Navigate to="/login" />;
  }

  // Then check profile completion if required
  if (requiresProfile && !isProfileCompleted && role === "Student") {
    toast.info("Please complete your profile first");
    return <Navigate to="/profile" />;
  }

  return (
    <>
      <ToastContainer />
      <Component />
    </>
  );
};

export default PrivateRoute;
