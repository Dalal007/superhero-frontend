import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "./components/Nav";
import Browse from "./pages/Browse";
import HeroDetail from "./pages/HomeDetail";
import TeamBuilder from "./pages/TeamBuilder";
import TeamCompare from "./pages/TeamCompare";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const { user, ready } = useSelector((state) => state.auth);
  
  if (!ready) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole) {
    const ranks = { viewer: 1, editor: 2, admin: 3 };
    if (ranks[user.role] < ranks[requiredRole]) {
      return (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need {requiredRole} privileges to access this page.</p>
        </div>
      );
    }
  }
  
  return children;
}

export default function App() {
  return (
    <div className="min-h-dvh bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <Nav />
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/hero/:id" element={<HeroDetail />} />
          <Route path="/team" element={<TeamBuilder />} />
          <Route path="/compare" element={
            <ProtectedRoute>
              <TeamCompare />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
