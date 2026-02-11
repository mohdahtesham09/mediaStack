import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userAuth = useSelector((state) => state?.users?.userAuth);
  const isAuthenticated = Boolean(userAuth?.userInfo?.token);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default ProtectedRoute;
