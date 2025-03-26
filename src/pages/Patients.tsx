
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { PatientCard } from "@/components/patients/PatientCard";
import { Filter, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const allPatients = [
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
  {
    id: "4",
    name: "Anjali Patel",
    age: 29,
    gender: "Female",
    regNo: "REG-2023-0037",
    phone: "9876543213",
    lastVisit: "1 week ago",
    condition: "stable" as const,
  },
  {
    id: "5",
    name: "Vikram Singh",
    age: 51,
    gender: "Male",
    regNo: "REG-2023-0035",
    phone: "9876543214",
    lastVisit: "2 weeks ago",
    condition: "followup" as const,
  },
  {
    id: "6",
    name: "Meera Joshi",
    age: 63,
    gender: "Female",
    regNo: "REG-2023-0031",
    phone: "9876543215",
    lastVisit: "1 month ago",
    condition: "followup" as const,
  },
  {
    id: "7",
    name: "Deepak Iyer",
    age: 49,
    gender: "Male",
    regNo: "REG-2023-0030",
    phone: "9876543216",
    lastVisit: "1 month ago",
    condition: "stable" as const,
  },
  {
    id: "8",
    name: "Lakshmi Nair",
    age: 39,
    gender: "Female",
    regNo: "REG-2023-0029",
    phone: "9876543217",
    lastVisit: "1 month ago",
    condition: "stable" as const,
  },
];

const criticalPatients = allPatients.filter(p => p.condition === "critical");
const followupPatients = allPatients.filter(p => p.condition === "followup");
const stablePatients = allPatients.filter(p => p.condition === "stable");

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<typeof allPatients>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string, type: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    setTimeout(() => {
      if (!query) {
        setFilteredPatients([]);
      } else {
        const results = allPatients.filter((patient) => {
          const searchField = 
            type === "name" ? patient.name : 
            type === "regNo" ? patient.regNo : 
            type === "phone" ? patient.phone : "";
            
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
            <a href="/new-patient">
              <UserPlus className="mr-2 h-5 w-5" />
              New Patient
            </a>
          </Button>
        </div>

        <div className="w-full flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>

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
                    <PatientCard key={patient.id} {...patient} />
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
      </div>
    </Layout>
  );
};

export default Patients;
