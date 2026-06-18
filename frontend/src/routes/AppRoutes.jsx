import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "../components/ProtectedRoute";

import UploadNotes from "../pages/UploadNotes";

import AskAI from "../pages/AskAI";

function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadNotes />
          </ProtectedRoute>
        }
    />
      <Route
        path="/ask"
        element={
          <ProtectedRoute>
            <AskAI />
          </ProtectedRoute>
        }
    />


    </Routes>

  );
}

export default AppRoutes;