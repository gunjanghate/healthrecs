
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

type UserRole = "doctor" | "staff" | "admin";

interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demo
const DEMO_USERS = {
  "doctor1": { 
    id: "1", 
    name: "Dr. Sanjay Gupta", 
    role: "doctor" as UserRole, 
    password: "password",
    department: "General Medicine" 
  },
  "staff1": { 
    id: "2", 
    name: "Neha Sharma", 
    role: "staff" as UserRole, 
    password: "password",
    department: "Reception" 
  },
  "admin1": { 
    id: "3", 
    name: "Raj Patel", 
    role: "admin" as UserRole, 
    password: "password",
    department: "Administration" 
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userRecord = DEMO_USERS[username as keyof typeof DEMO_USERS];
        
        if (userRecord && userRecord.password === password) {
          const { password: _, ...userWithoutPassword } = userRecord;
          setUser(userWithoutPassword);
          toast.success(`Welcome back, ${userWithoutPassword.name}`);
          resolve(true);
        } else {
          toast.error("Invalid username or password");
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    toast.info("You have been logged out");
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    
    // For demo purposes only - in a real application, this would be a backend call
    // and would likely involve different authentication
    setUser({ ...user, role });
    toast.success(`Switched to ${role} role`);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
