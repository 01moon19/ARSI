import { Navigate } from "react-router-dom";

import { getUserFromToken } from "../utils/auth";

function AdminRoute({
  children,
}) {

  const user =
    getUserFromToken();

  if (!user) {

    return (
      <Navigate to="/login" />
    );
  }

  if (user.role !== "admin") {

    return (
      <Navigate to="/app/dashboard" />
    );
  }

  return children;
}

export default AdminRoute;