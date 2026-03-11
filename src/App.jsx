import { ToastContainer } from "react-toastify";
import HabitsPage from "./Habit/Page";
import EntriesPage from "./Entry/Page";
import NavMenu from "./NavMenu";
import LoginPage from "./Auth/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "./Auth/Register";
import ProtectedRoute from "./Auth/ProtectedRoute";

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={4000} />
      <NavMenu />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<EntriesPage />} />
            <Route path="/habits" element={<HabitsPage />} />

            {/* Default: redirect / to /dashboard if authenticated */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
