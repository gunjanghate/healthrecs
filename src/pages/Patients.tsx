import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { PatientCard } from "@/components/patients/PatientCard";
import { Filter, Plus, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

// Define patient interface based on API response
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
  [key: string]: any;
}

// Interface for what PatientCard expects
interface PatientCardProps {
  id: string;
  name: string;
  age: number;
  gender: string;
  regNo: string;
  phone: string;
  lastVisit: string;
  condition: "critical" | "followup" | "stable";
}

const Patients = () => {
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to determine patient condition based on otherAilments or other criteria
  // MOVED THIS FUNCTION BEFORE IT'S USED
  const determineCondition = (patient: Patient): "critical" | "followup" | "stable" => {
    // Check for critical conditions based on otherAilments
    if (patient.otherAilments && (
      patient.otherAilments.cancer || 
      patient.otherAilments.tuberculosis || 
      patient.otherAilments.ischemicHeartDisease
    )) {
      return "critical";
    }
    
    // Determine follow-up conditions
    if (patient.otherAilments && (
      patient.otherAilments.hypertension || 
      patient.otherAilments.parkinsons ||
      patient.otherAilments.majorSurgery ||
      patient.otherAilments.relapse
    )) {
      return "followup";
    }
    
    // Default to stable
    return "stable";
  };

  // Derived patient lists based on condition
  const criticalPatients = allPatients.filter(p => determineCondition(p) === "critical");
  const followupPatients = allPatients.filter(p => determineCondition(p) === "followup");
  const stablePatients = allPatients.filter(p => determineCondition(p) === "stable");

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://health-link-backend.vercel.app/records");
        
        // Check if response.data exists and is an array
        if (response.data && Array.isArray(response.data)) {
          setAllPatients(response.data);
        } else {
          setAllPatients([]);
          console.warn("API response format is unexpected:", response.data);
        }
      } catch (error) {
        console.error("Error fetching patient records:", error);
        setError("Failed to load patient data. Please try again later.");
        setAllPatients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);
  
  const handleSearch = (query: string, type: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    setTimeout(() => {
      if (!query) {
        setFilteredPatients([]);
      } else {
        const results = allPatients.filter((patient) => {
          // Map the type to the correct field name in our API response
          const searchField = 
            type === "name" ? (patient.name || "") : 
            type === "regNo" ? (patient.regNo || "") : 
            type === "phone" ? (patient.mobileNo || "") : "";
            
          return searchField.toLowerCase().includes(query.toLowerCase());
        });
        
        setFilteredPatients(results);
      }
      setIsSearching(false);
    }, 500);
  };

  const getPatientsByTab = () => {
    if (searchQuery) return filteredPatients;
    
    switch (currentTab) {
      case "critical":
        return criticalPatients;
      case "followup":
        return followupPatients;
      case "stable":
        return stablePatients;
      default:
        return allPatients;
    }
  };

  // Adapter function to map API patient to PatientCard props
  const adaptPatientForCard = (patient: Patient): PatientCardProps => {
    return {
      id: patient._id,
      name: patient.name,
      age: patient.age,
      gender: patient.sex === "M" ? "Male" : patient.sex === "F" ? "Female" : "Other",
      regNo: patient.regNo,
      phone: patient.mobileNo,
      lastVisit: patient.visits && patient.visits.length > 0 && patient.visits[patient.visits.length - 1].date
        ? new Date(patient.visits[patient.visits.length - 1].date).toLocaleDateString()
        : "No visits recorded",
      condition: determineCondition(patient)
    };
  };

  const displayedPatients = getPatientsByTab();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Records</h1>
            <p className="text-muted-foreground">
              View and manage patient information
            </p>
          </div>
          
          <Button size="lg" asChild>
            <a href="https://healthrecs.vercel.app/new-patient">
              <UserPlus className="mr-2 h-5 w-5" />
              New Patient
            </a>
          </Button>
        </div>

        <div className="w-full flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
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
        ) : (
          <Tabs 
            defaultValue="all" 
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">
                  All Patients
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                    {allPatients.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="critical">
                  <span className="text-health-danger">Critical</span>
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-health-danger/20 text-health-danger text-xs">
                    {criticalPatients.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="followup">
                  <span className="text-health-warning">Follow-up</span>
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-health-warning/20 text-health-warning text-xs">
                    {followupPatients.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="stable">
                  <span className="text-health-success">Stable</span>
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-health-success/20 text-health-success text-xs">
                    {stablePatients.length}
                  </span>
                </TabsTrigger>
              </TabsList>
              
              <div className="hidden md:flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-1 h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Notes
                </Button>
              </div>
            </div>

            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse text-center">
                  <p className="text-lg">Searching patients...</p>
                </div>
              </div>
            ) : (
              <TabsContent value={currentTab} className="m-0">
                {searchQuery && (
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredPatients.length} results for "{searchQuery}"
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSearchQuery("");
                        setFilteredPatients([]);
                      }}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
                
                <div className="space-y-4">
                  {displayedPatients.length > 0 ? (
                    displayedPatients.map((patient) => (
                      <PatientCard key={patient._id} {...adaptPatientForCard(patient)} />
                    ))
                  ) : (
                    <div className="health-card text-center py-12">
                      <p className="text-lg text-muted-foreground">No patients found</p>
                      {searchQuery && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Try a different search term or clear the search
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Patients;