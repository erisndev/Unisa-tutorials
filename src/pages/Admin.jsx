import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthAPI } from "../api/auth";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminOverview from "./admin/AdminOverview";
import AdminFaculties from "./admin/AdminFaculties";
import AdminCourses from "./admin/AdminCourses";
import AdminModules from "./admin/AdminModules";
import AdminPackages from "./admin/AdminPackages";
import AdminOrders from "./admin/AdminOrders";
import AdminAnalytics from "./admin/AdminAnalytics";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(AuthAPI.isLoggedIn());

  const handleLogout = () => {
    AuthAPI.logout();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout onLogout={handleLogout} />}>
        <Route index element={<AdminOverview />} />
        <Route path="faculties" element={<AdminFaculties />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="modules" element={<AdminModules />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
