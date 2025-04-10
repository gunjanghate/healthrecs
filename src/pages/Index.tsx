import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { PatientCard } from "@/components/patients/PatientCard";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, FileText, ListFilter, Plus, User, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Add this import for Link
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

// Define a type for patient data based on the actual API response
interface Patient {
  _id: string;
  regNo: string;
  name: string;
  age: number;
  sex: string;
  mobileNo: string;
  address: string;
  dateOfAdmission: string;
  bloodGroup: string;
  otherAilments: Record<string, boolean>;
  visits: Array<{
    date: string | null;
    investigation: string;
    treatmentGiven: string;
    _id: string;
  }>;
  createdAt: string;
  [key: string]: any; // For any other fields the patient might have
}

const Dashboard = () => {
  const { user } = useAuth();
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://health-link-backend.vercel.app/records");
        
        // Check if response.data exists and is an array
        if (response.data && Array.isArray(response.data)) {
          // Sort by createdAt date (newest first)
          const sortedPatients = [...response.data].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          setRecentPatients(sortedPatients);
          setTotalPatients(sortedPatients.length);
        } else {
          // If the structure isn't as expected, initialize with empty arrays
          setRecentPatients([]);
          setTotalPatients(0);
          console.warn("API response format is unexpected:", response.data);
        }
      } catch (error) {
        console.error("Error fetching patient records:", error);
        setError("Failed to load patient data. Please try again later.");
        // Initialize with empty arrays on error
        setRecentPatients([]);
        setTotalPatients(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);
  
  const handleSearch = (query: string, type: string) => {
    // Simulating search
    setIsSearching(true);
    
    setTimeout(() => {
      if (!query) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      // Make sure recentPatients is an array before filtering
      if (Array.isArray(recentPatients)) {
        // Mock search results based on the query
        const results = recentPatients.filter((patient) => {
          // Map the type to the correct field name in our API response
          const searchField = 
            type === "name" ? (patient.name || "") : 
            type === "regNo" ? (patient.regNo || "") : 
            type === "phone" ? (patient.mobileNo || "") : // Note: API uses mobileNo not phone
            "";
            
          return searchField.toLowerCase().includes(query.toLowerCase());
        });
        
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      
      setIsSearching(false);
    }, 500);
  };

  // Helper function to adapt the patient data for PatientCard component
  const adaptPatientForCard = (patient: Patient) => {
    // Map the patient properties to match what PatientCard expects
    return {
      id: patient._id,
      name: patient.name,
      regNo: patient.regNo,
      age: patient.age,
      gender: patient.sex,
      phone: patient.mobileNo,
      address: patient.address,
      lastVisit: patient.visits && patient.visits.length > 0 
        ? (patient.visits[patient.visits.length - 1].date || 'N/A') 
        : 'N/A',
      // Add any other fields needed by PatientCard
    };
  };

  // Get only the first 3 patients for display
  const recentPatientsToShow = recentPatients.slice(0, 3);
  const hasMorePatients = recentPatients.length > 3;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
              Welcome back, <span className="font-semibold dark:text-white/70 text-black/70">{user?.name || "User"}</span>
            </p>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-lg">Loading patients...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : isSearching ? (
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
                <PatientCard condition={"stable"} key={patient._id} {...adaptPatientForCard(patient)} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Patients"
                value={totalPatients}
                description="Lifetime registered patients"
                icon={Users}
                trend={5}
              />
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
              </div>
              
              <div className="space-y-4">
                {recentPatientsToShow.length > 0 ? (
                  <>
                    {recentPatientsToShow.map((patient) => (
                      <PatientCard condition={"stable"} key={patient._id} {...adaptPatientForCard(patient)} />
                    ))}
                    
                    {hasMorePatients && (
                      <div className="flex justify-center mt-4">
                        <Link to="/patients" className="text-cyan-500 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2">
                          <span>View more patients</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent patients found.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;