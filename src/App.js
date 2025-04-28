import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { AppProvider } from "./contexts/AppContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Error from "./pages/Error";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Initiator from "./pages/Initiator";
import { FlashMessageProvider } from "./contexts/FlashMessageContext";
import Reviewer1 from "./pages/Reviewer1";
import Reviewer2 from "./pages/Reviewer2";
import Approver from "./pages/Approver";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <FlashMessageProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Initiator"
                element={
                  <ProtectedRoute>
                    <Initiator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Reviewer1"
                element={
                  <ProtectedRoute>
                    <Reviewer1 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Reviewer2"
                element={
                  <ProtectedRoute>
                    <Reviewer2 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Approver"
                element={
                  <ProtectedRoute>
                    <Approver />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Error />} />
            </Routes>
          </FlashMessageProvider>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
