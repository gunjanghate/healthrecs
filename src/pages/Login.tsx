
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "There was a problem with your login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials
  const demoCredentials = [
    { label: "Doctor Demo", username: "doctor1", password: "password" },
    { label: "Staff Demo", username: "staff1", password: "password" },
    { label: "Admin Demo", username: "admin1", password: "password" },
  ];

  const loginWithDemo = (demoUser: { username: string, password: string }) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="health-card max-w-md w-full p-8 space-y-8">
        <div className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center rounded-xl mb-4">
            <span className="font-bold text-xl">HR</span>
          </div>
          <h1 className="text-2xl font-bold">HealthRecs Login</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access the health records system
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="health-input w-full"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="health-input w-full"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Demo Accounts
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {demoCredentials.map((demo, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-xs h-auto py-1"
                onClick={() => loginWithDemo(demo)}
                disabled={isLoading}
              >
                {demo.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
