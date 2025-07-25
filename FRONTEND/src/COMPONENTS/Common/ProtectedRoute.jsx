// import { useSelector } from "react-redux"
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, role }) => {
//     const { user } = useSelector((state) => state.auth);

//     if (!user || (role && user.role !== role)) {
//         return <Navigate to="/login" replace />
//     }
//     return children;
// };

// export default ProtectedRoute;

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Logged in but role mismatch
    return <Navigate to="/" replace />;
  }

  // Authorized - render nested routes
  return <Outlet />;
};

export default ProtectedRoute;
