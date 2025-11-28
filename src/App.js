// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// // import Navbar from "./components/Navbar/Navbar";
// // import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// // import Orders from "./components/Orders/Orders";
// // import Materials from "./components/Materials/Materials";
// // import Cleaning from "./components/Cleaning/Cleaning";
// // import Packing from "./components/Packing/Packing";
// // import Settings from "./components/Settings/Settings";
// // import Dashboard from "./components/Dashboard/Dashboard";
// // import TrackOrder from "./components/TrackOrder/TrackOrder";

// // import Login from "./components/Login/Login";
// // import Signup from "./components/Signup/Signup";
// // import NotFound from "./components/NotFound/NotFound";

// // function App() {
// //   const isLoggedIn = !!localStorage.getItem("user"); // adjust the key name you use in localStorage

// //   return (
// //     <Router>
// //       {isLoggedIn && <Navbar />}

// //       <Routes>
// //         <Route
// //           path="/login"
// //           element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
// //         />
// //         <Route
// //           path="/signup"
// //           element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />}
// //         />

// //         <Route
// //           path="/"
// //           element={
// //             <ProtectedRoute isLoggedIn={isLoggedIn}>
// //               <Dashboard />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/dashboard"
// //           element={
// //             <ProtectedRoute isLoggedIn={isLoggedIn}>
// //               <Dashboard />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/track-order"
// //           element={
// //             <ProtectedRoute isLoggedIn={isLoggedIn}>
// //               <TrackOrder />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/orders"
// //           element={
// //             <ProtectedRoute isLoggedIn={isLoggedIn}>
// //               <Orders />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/raw-materials"
// //           element={
// //             <ProtectedRoute isLoggedIn={isLoggedIn}>
// //               <Materials />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/cleaning"
// //           element={
// //             <ProtectedRoute isLoggedIn={isLoggedIn}>
// //               <Cleaning />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/packing"
// //           element={
// //             <ProtectedRoute isLoggedIn={isLoggedIn}>
// //               <Packing />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/settings"
// //           element={
// //             <ProtectedRoute isLoggedIn={isLoggedIn}>
// //               <Settings />
// //             </ProtectedRoute>
// //           }
// //         />

// //         {/* Fallback route */}
// //         <Route path="*" element={<NotFound/> } />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;








// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./components/Navbar/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// import Orders from "./components/Orders/Orders";
// import Materials from "./components/Materials/Materials";
// import Cleaning from "./components/Cleaning/Cleaning";
// import Packing from "./components/Packing/Packing";
// import Settings from "./components/Settings/Settings";
// import Dashboard from "./components/Dashboard/Dashboard";
// import TrackOrder from "./components/TrackOrder/TrackOrder";

// import Login from "./components/Login/Login";
// import Signup from "./components/Signup/Signup";
// import NotFound from "./components/NotFound/NotFound";

// function App() {
//   const isLoggedIn = !!localStorage.getItem("user");

//   return (
//     <Router>
//       {isLoggedIn && <Navbar />}

//       <Routes>

//         {/* Public routes */}
//         <Route
//           path="/login"
//           element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
//         />

//         <Route
//           path="/signup"
//           element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />}
//         />

//         {/* Redirect root to dashboard */}
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />

//         {/* Protected routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/track-order"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <TrackOrder />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/orders"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <Orders />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/raw-materials"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <Materials />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/cleaning"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <Cleaning />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/packing"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <Packing />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/settings"
//           element={
//             <ProtectedRoute isLoggedIn={isLoggedIn}>
//               <Settings />
//             </ProtectedRoute>
//           }
//         />

//         {/* Catch All - Not Found */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Orders from "./components/Orders/Orders";
import Materials from "./components/Materials/Materials";
import Cleaning from "./components/Cleaning/Cleaning";
import Packing from "./components/Packing/Packing";
import Settings from "./components/Settings/Settings";
import Dashboard from "./components/Dashboard/Dashboard";
import TrackOrder from "./components/TrackOrder/TrackOrder";

import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import NotFound from "./components/NotFound/NotFound";

function App() {
  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <Router>
      {/* Navbar only when logged in */}
      {isLoggedIn && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup />}
        />

        {/* Root path */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-order"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <TrackOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/raw-materials"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Materials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cleaning"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Cleaning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/packing"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Packing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
