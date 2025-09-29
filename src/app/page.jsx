"use client";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "../components/dashboard/Dashboard";
import "../styles/globals.css";

function AppContent() {
  const { isAuthenticated, view } = useContext(AuthContext);

  if (!isAuthenticated) {
    return view === 'register' ? <Register /> : <Login />;
  }

  return <Dashboard />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
