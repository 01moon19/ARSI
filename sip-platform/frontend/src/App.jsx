import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import UploadPage from "./pages/UploadPage";
import AdminPage from "./pages/AdminPage";
import DocumentsPage from "./pages/DocumentsPage";

import AppLayout from "./layouts/AppLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        {/* APP ROUTES */}

        <Route
          path="/app"
          element={
            <ProtectedRoute>

              <AppLayout />

            </ProtectedRoute>
          }
        >

          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="chat"
            element={<ChatPage />}
          />

          <Route
            path="documents"
            element={<DocumentsPage />}
          />

          <Route
            path="upload"
            element={
              <AdminRoute>

                <UploadPage />

              </AdminRoute>
            }
          />

          <Route
            path="users"
            element={
              <AdminRoute>

                <AdminPage />

              </AdminRoute>
            }
          />

        </Route>

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;