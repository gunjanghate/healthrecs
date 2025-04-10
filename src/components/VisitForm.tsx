import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Check, Save, User, FileText } from "lucide-react";
import { toast } from "sonner";

const VisitForm = () => {
  const { id } = useParams(); // Get regNo from URL
  const navigate = useNavigate();
  const [visitData, setVisitData] = useState({
    investigation: "",
    treatmentGiven: ""
  });
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch patient details
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(`https://health-link-backend.vercel.app/record/${id}`);
        setPatient(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching patient:", err);
        toast.error("Failed to load patient details", {
          description: "Please check the registration number and try again.",
        });
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    setVisitData({ ...visitData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      toast.error("Registration number is missing");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`https://health-link-backend.vercel.app/${id}/visits`, visitData);
      setSuccess(true);
      toast.success("Visit added successfully", {
        description: "The patient's visit has been recorded.",
      });
    } catch (err) {
      console.error("Error adding visit:", err);
      toast.error("Failed to add visit", {
        description: "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto pt-8 text-center">
          <p className="text-lg">Loading patient details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Add Visit Record</h1>
          </div>
        </div>

        {success ? (
          <div className="health-card text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 bg-health-success/20 rounded-full flex items-center justify-center text-health-success">
                <Check className="h-8 w-8" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">Visit Recorded</h2>
                <p className="text-muted-foreground mt-2">
                  The visit information has been successfully saved
                </p>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button onClick={() => {
                  setSuccess(false);
                  setVisitData({ investigation: "", treatmentGiven: "" });
                }}>
                  <FileText className="mr-2 h-5 w-5" />
                  Add Another Visit
                </Button>
                <Button variant="outline" onClick={() => navigate("/treatment")}>
                  <User className="mr-2 h-5 w-5" />
                  Return to Patient List
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {patient && (
              <div className="health-card">
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
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{patient.phone || "Not provided"}</p>
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
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="health-card">
                <h2 className="text-xl font-semibold mb-6">Visit Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
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
                      <label htmlFor="investigation" className="text-sm font-medium">
                        Investigation Details <span className="text-health-danger">*</span>
                      </label>
                      <textarea 
                        id="investigation" 
                        name="investigation"
                        value={visitData.investigation}
                        onChange={handleChange}
                        className="health-input w-full h-24 resize-none" 
                        placeholder="Enter investigation details"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="treatmentGiven" className="text-sm font-medium">
                        Treatment Given <span className="text-health-danger">*</span>
                      </label>
                      <textarea 
                        id="treatmentGiven" 
                        name="treatmentGiven"
                        value={visitData.treatmentGiven}
                        onChange={handleChange}
                        className="health-input w-full h-36 resize-none" 
                        placeholder="Enter treatment provided"
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
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/treatment")}
                >
                  Back to Patients
                </Button>
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Visit Record
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default VisitForm;






// import React, { useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// export default function VisitForm() {
//   const { id } = useParams(); // Get regNo from URL
//   const [visitData, setVisitData] = useState({
//     investigation: '',
//     treatmentGiven: ''
//   });

//   const handleChange = (e) => {
//     setVisitData({ ...visitData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!id) {
//       alert("Registration number is missing in the URL.");
//       return;
//     }
//     try {
//       await axios.post(`https://health-link-backend.vercel.app/${id}/visits`, visitData);
//       alert("Visit added successfully");
//       setVisitData({ investigation: "", treatmentGiven: "" });
//     } catch (err) {
//       console.error(err);
//       alert("Error adding visit");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow-md max-w-xl mx-auto mt-8">
//       <h2 className="text-xl font-bold mb-2">Add Visit Record for RegNo: {id}</h2>
//       <input
//         type="text"
//         name="investigation"
//         placeholder="Investigation Details"
//         value={visitData.investigation}
//         onChange={handleChange}
//         className="w-full p-2 border rounded"
//         required
//       />
//       <input
//         type="text"
//         name="treatmentGiven"
//         placeholder="Treatment Given"
//         value={visitData.treatmentGiven}
//         onChange={handleChange}
//         className="w-full p-2 border rounded"
//         required
//       />
//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//         Add Visit
//       </button>
//     </form>
//   );
// }

