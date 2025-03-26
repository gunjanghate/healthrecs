
import React, { ReactNode } from "react";
import { Header } from "./Header";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: Array<"doctor" | "staff" | "admin">;
}

export function Layout({ 
  children, 
  requireAuth = true,
  allowedRoles = ["doctor", "staff", "admin"]
}: LayoutProps) {
  const { isAuthenticated, user } = useAuth();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <Header />}
      <main className="flex-1">
        <div className="container max-w-screen-2xl py-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
