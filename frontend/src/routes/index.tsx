// src/Routes.tsx
import AdminDashboard from "@/dashboard/AdminDashboard";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy-loaded components
const Home = lazy(() => import("../pages/Home"));
const GameLinks = lazy(() => import("../pages/GameLinks"));
const AcceptPayment = lazy(() => import("../components/AcceptPayment"));
const Navbar = lazy(() => import("../components/Navbar"));
const AdminNavbar = lazy(() => import("../components/AdminNavbar"));
const TopWheelersPanel = lazy(() => import("../components/TopWheelersPanel"));
const BackendStatus = lazy(() => import("../components/BackendStatus"));

// Layouts
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-black/75 text-white">
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <Navbar />
      <div className="px-4 sm:px-8 md:px-16 py-4">{children}</div>
    </Suspense>
  </div>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className=" min-h-screen bg-cover bg-center bg-no-repeat text-white ">
    <div className="bg-black/70 min-h-screen ">
      <AdminNavbar />
      {children}
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Main Website Routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
              <TopWheelersPanel />
              <GameLinks />
              <AcceptPayment />
              <BackendStatus />
            </MainLayout>
          }
        />

        {/* Admin Panel Routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="*"
          element={
            <div className="text-center text-white p-10">
              404 - Page Not Found matherchod
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
