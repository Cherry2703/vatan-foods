// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ isLoggedIn, children }) => {
//   if (!isLoggedIn) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute;




import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login and save the current location
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

