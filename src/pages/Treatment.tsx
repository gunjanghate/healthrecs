import React, { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Plus, FileText, User, Search } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Link } from "react-router-dom";

const Treatment = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  
  // Debounce function to limit filter operations
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    
    return debouncedValue;
  };
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Fetch all patients when component mounts
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://health-link-backend.vercel.app/records");
        setPatients(response.data);
        setFilteredPatients(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patients. Please try again later.");
        setIsLoading(false);
        toast.error("Failed to load patients", {
          description: "Please check your connection and try again.",
        });
      }
    };

    fetchPatients();
  }, []);

  // Filter patients whenever debounced search query changes
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const query = debouncedSearchQuery.toLowerCase().trim();
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.regNo.toLowerCase().includes(query) ||
      (patient.mobileNo && patient.mobileNo.includes(query))
    );

    setFilteredPatients(filtered);
    
    if (filtered.length === 0 && patients.length > 0 && query.length > 2) {
      toast.info("No matching patients found", {
        description: "Try a different search term or check the spelling.",
      });
    }
  }, [debouncedSearchQuery, patients]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ArrowLeft className="h-5 w-5" />
              </a>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Treatment Entry</h1>
          </div>
        </div>
        
        <p className="text-muted-foreground">
          Search for a patient to view or add treatment information
        </p>
        
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="health-input pl-10 w-full"
              placeholder="Search by name, registration number or phone"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="health-card text-center py-8">
            <p className="text-lg">Loading patients...</p>
          </div>
        ) : error ? (
          <div className="health-card text-center py-8">
            <p className="text-lg text-health-danger">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="health-card text-center py-8">
            <p className="text-lg">No patients found matching your search criteria</p>
            <p className="text-muted-foreground mt-2">
              Try searching with a different term or{" "}
              <a href="/new-patient" className="text-primary hover:underline">
                register a new patient
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div className="health-card" key={patient.regNo}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-6 w-6" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{patient.age} yrs, {patient.gender}</span>
                        <span className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {patient.regNo}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/${patient.regNo}/visits`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Visit
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{patient.mobileNo || "Not provided"}</p>
                  </div>
                  {patient.bloodGroup && (
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Group</p>
                      <p>{patient.bloodGroup}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Last Visit</p>
                    <p className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {patient.lastVisit || "No record"}
                    </p>
                  </div>
                </div>
                
                {patient.visits && patient.visits.length > 0 && (
                  <div className="mt-6 border-t pt-4 border-border">
                    <h4 className="font-medium mb-2">Recent Visits</h4>
                    <div className="space-y-2">
                      {patient.visits.slice(0, 2).map((visit, index) => (
                        <div key={index} className="p-3 bg-muted rounded-md">
                          <div className="text-sm"><strong>Investigation:</strong> {visit.investigation}</div>
                          <div className="text-sm"><strong>Treatment:</strong> {visit.treatmentGiven}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Treatment;

