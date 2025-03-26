
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Check, Clock, FileText, User } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Treatment = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [patientFound, setPatientFound] = useState(false);
  const [treatmentSaved, setTreatmentSaved] = useState(false);
  
  const handleSearch = (query: string, type: string) => {
    setSearchPerformed(true);
    
    // Mock API call
    setTimeout(() => {
      if (query.toLowerCase().includes("arun") || query === "9876543210" || query === "REG-2023-0042") {
        setPatientFound(true);
      } else {
        setPatientFound(false);
        if (query) {
          toast.error("Patient not found", {
            description: "No patient matches the search criteria.",
          });
        }
      }
    }, 800);
  };
  
  const handleSaveTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock API call
    toast.success("Treatment record saved successfully", {
      description: "The treatment information has been recorded.",
    });
    
    setTreatmentSaved(true);
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
          
          {patientFound && !treatmentSaved && (
            <Button variant="outline" onClick={() => {
              setPatientFound(false);
              setSearchPerformed(false);
            }}>
              Change Patient
            </Button>
          )}
        </div>
        
        {treatmentSaved ? (
          <div className="health-card text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 bg-health-success/20 rounded-full flex items-center justify-center text-health-success">
                <Check className="h-8 w-8" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">Treatment Recorded</h2>
                <p className="text-muted-foreground mt-2">
                  The treatment information has been successfully saved
                </p>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <a href="/treatment">
                    <FileText className="mr-2 h-5 w-5" />
                    New Treatment Entry
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/patients">
                    <User className="mr-2 h-5 w-5" />
                    View Patient List
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : !patientFound ? (
          <>
            <p className="text-muted-foreground">
              Search for a patient to enter treatment information
            </p>
            
            <div className="w-full flex justify-center">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {searchPerformed && !patientFound && (
              <div className="health-card text-center py-8">
                <p className="text-lg">No patient found matching your search criteria</p>
                <p className="text-muted-foreground mt-2">
                  Try searching with a different term or{" "}
                  <a href="/new-patient" className="text-primary hover:underline">
                    register a new patient
                  </a>
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="health-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Arun Mehta</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>45 yrs, Male</span>
                      <span className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        REG-2023-0042
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="status-critical px-3 py-1 rounded-full text-xs font-medium w-fit">
                  Critical Attention
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>9876543210</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p>O+</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Visit</p>
                  <p className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Today
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSaveTreatment} className="space-y-6">
              <div className="health-card">
                <h2 className="text-xl font-semibold mb-6">Treatment Information</h2>
                
                <Tabs defaultValue="outpatient" className="w-full mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="outpatient">Outpatient</TabsTrigger>
                    <TabsTrigger value="inpatient">Inpatient</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="outpatient" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="visitDate" className="text-sm font-medium">
                          Visit Date <span className="text-health-danger">*</span>
                        </label>
                        <input 
                          id="visitDate" 
                          type="date" 
                          className="health-input w-full"
                          defaultValue={new Date().toISOString().split('T')[0]}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="visitTime" className="text-sm font-medium">
                          Visit Time
                        </label>
                        <div className="flex items-center health-input">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <input 
                            id="visitTime" 
                            type="time" 
                            className="flex-1 outline-none bg-transparent" 
                            defaultValue={new Date().toTimeString().slice(0, 5)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inpatient" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="admissionDate" className="text-sm font-medium">
                          Admission Date <span className="text-health-danger">*</span>
                        </label>
                        <input 
                          id="admissionDate" 
                          type="date" 
                          className="health-input w-full"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="wardNumber" className="text-sm font-medium">
                          Ward/Room Number <span className="text-health-danger">*</span>
                        </label>
                        <input 
                          id="wardNumber" 
                          className="health-input w-full"
                          placeholder="Enter ward/room" 
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="bodyTemperature" className="text-sm font-medium">
                        Body Temperature (°F)
                      </label>
                      <input 
                        id="bodyTemperature" 
                        type="number" 
                        step="0.1"
                        className="health-input w-full" 
                        placeholder="Enter temperature"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bloodPressure" className="text-sm font-medium">
                        Blood Pressure (mm Hg)
                      </label>
                      <input 
                        id="bloodPressure" 
                        className="health-input w-full" 
                        placeholder="e.g., 120/80"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="weight" className="text-sm font-medium">
                        Weight (kg)
                      </label>
                      <input 
                        id="weight" 
                        type="number" 
                        step="0.1"
                        className="health-input w-full" 
                        placeholder="Enter weight"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="pulseRate" className="text-sm font-medium">
                        Pulse Rate (bpm)
                      </label>
                      <input 
                        id="pulseRate" 
                        type="number" 
                        className="health-input w-full" 
                        placeholder="Enter pulse rate"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="chiefComplaints" className="text-sm font-medium">
                      Chief Complaints <span className="text-health-danger">*</span>
                    </label>
                    <textarea 
                      id="chiefComplaints" 
                      className="health-input w-full h-24 resize-none" 
                      placeholder="Enter chief complaints"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="diagnosis" className="text-sm font-medium">
                      Diagnosis <span className="text-health-danger">*</span>
                    </label>
                    <textarea 
                      id="diagnosis" 
                      className="health-input w-full h-24 resize-none" 
                      placeholder="Enter diagnosis"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="treatment" className="text-sm font-medium">
                      Treatment Plan <span className="text-health-danger">*</span>
                    </label>
                    <textarea 
                      id="treatment" 
                      className="health-input w-full h-36 resize-none" 
                      placeholder="Enter treatment plan"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="followUpDate" className="text-sm font-medium">
                      Follow-up Date
                    </label>
                    <input 
                      id="followUpDate" 
                      type="date" 
                      className="health-input w-full" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Additional Notes
                    </label>
                    <textarea 
                      id="notes" 
                      className="health-input w-full h-24 resize-none" 
                      placeholder="Enter any additional notes"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setPatientFound(false);
                    setSearchPerformed(false);
                  }}
                >
                  Change Patient
                </Button>
                <Button type="submit" size="lg">
                  Save Treatment Record
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Treatment;
