
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { PatientCard } from "@/components/patients/PatientCard";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, FileText, ListFilter, Plus, User, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const recentPatients = [
  {
    id: "1",
    name: "Arun Mehta",
    age: 45,
    gender: "Male",
    regNo: "REG-2023-0042",
    phone: "9876543210",
    lastVisit: "Today",
    condition: "critical" as const,
  },
  {
    id: "2",
    name: "Priya Sharma",
    age: 32,
    gender: "Female",
    regNo: "REG-2023-0039",
    phone: "9876543211",
    lastVisit: "Yesterday",
    condition: "followup" as const,
  },
  {
    id: "3",
    name: "Raj Kumar",
    age: 58,
    gender: "Male",
    regNo: "REG-2023-0038",
    phone: "9876543212",
    lastVisit: "3 days ago",
    condition: "stable" as const,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<typeof recentPatients>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (query: string, type: string) => {
    // Simulating search
    setIsSearching(true);
    
    setTimeout(() => {
      if (!query) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      // Mock search results based on the query
      const results = recentPatients.filter((patient) => {
        const searchField = 
          type === "name" ? patient.name : 
          type === "regNo" ? patient.regNo : 
          type === "phone" ? patient.phone : "";
          
        return searchField.toLowerCase().includes(query.toLowerCase());
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
              Welcome back, <span className="font-semibold dark:text-white/70 text-black/70">{user?.name}</span>
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto" size="lg">
                <UserPlus className="mr-2 h-5 w-5" />
                New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Register New Patient</DialogTitle>
                <DialogDescription>
                  Quick registration form for new patients.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="quick" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="quick">Quick Entry</TabsTrigger>
                  <TabsTrigger value="full">Full Registration</TabsTrigger>
                </TabsList>
                <TabsContent value="quick" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Patient Name *
                      </label>
                      <input id="name" className="health-input w-full" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number *
                      </label>
                      <input id="phone" className="health-input w-full" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="age" className="text-sm font-medium">
                        Age *
                      </label>
                      <input id="age" type="number" className="health-input w-full" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="gender" className="text-sm font-medium">
                        Gender *
                      </label>
                      <select id="gender" className="health-input w-full">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full">Register & Continue</Button>
                </TabsContent>
                <TabsContent value="full" className="py-4">
                  <p className="text-center text-muted-foreground pb-4">
                    For full registration, please go to the{" "}
                    <a href="/new-patient" className="text-primary hover:underline">
                      New Patient
                    </a>{" "}
                    page.
                  </p>
                  <Button className="w-full" variant="outline" asChild>
                    <a href="/new-patient">Go to Full Registration</a>
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <div className="w-full flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {isSearching ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-lg">Searching patients...</p>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchResults([])}
              >
                Clear Results
              </Button>
            </div>
            <div className="space-y-4">
              {searchResults.map((patient) => (
                <PatientCard key={patient.id} {...patient} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Patients"
                value="1,284"
                description="Lifetime registered patients"
                icon={Users}
                trend={5}
              />
              {/* <StatCard
                title="New Patients"
                value="42"
                description="Added this month"
                icon={UserPlus}
                variant="info"
                trend={12}
              /> */}
              {/* <StatCard
                title="Follow-ups Due"
                value="18"
                description="Pending appointments"
                icon={CalendarDays}
                variant="warning"
                trend={-3}
              />
              <StatCard
                title="Critical Cases"
                value="5"
                description="Require immediate attention"
                icon={FileText}
                variant="danger"
                trend={0}
              /> */}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DashboardCard
                title="Register New Patient"
                description="Add a new patient to the system"
                icon={UserPlus}
                to="/new-patient"
               
              />
              <DashboardCard
                title="Patient Records"
                description="View and manage patient information"
                icon={User}
                to="/patients"
              />
              <DashboardCard
                title="Treatment Entry"
                description="Record diagnosis and treatment"
                icon={FileText}
                to="/treatment"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Patients</h2>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/patients">
                    View All
                  </a>
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <ListFilter className="mr-1 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Patient Note
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <PatientCard key={patient.id} {...patient} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
