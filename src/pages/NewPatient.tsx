
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clipboard, FileText, Save, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const NewPatient = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success toast
    toast.success("Patient registered successfully!", {
      description: "The patient has been added to the system.",
      duration: 5000,
    });
    
    setFormSubmitted(true);
  };
  
  const moveToStep = (step: number) => {
    if (step < 1) step = 1;
    if (step > 3) step = 3;
    setCurrentStep(step);
  };

  if (formSubmitted) {
    return (
      <Layout>
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/patients">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Patient Registered</h1>
          </div>
          
          <div className="health-card text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 bg-health-success/20 rounded-full flex items-center justify-center text-health-success">
                <FileText className="h-8 w-8" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">Registration Complete</h2>
                <p className="text-muted-foreground mt-2">
                  The patient has been successfully registered in the system
                </p>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link to="/patients">
                    <Clipboard className="mr-2 h-5 w-5" />
                    View Patient List
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/new-patient">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Register Another Patient
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/patients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Register New Patient</h1>
        </div>
        
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className={`rounded-full flex items-center justify-center w-8 h-8 ${
                currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                1
              </div>
              <div className={`h-1 w-10 md:w-24 ${
                currentStep >= 2 ? "bg-primary" : "bg-muted"
              }`}></div>
              <div className={`rounded-full flex items-center justify-center w-8 h-8 ${
                currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                2
              </div>
              <div className={`h-1 w-10 md:w-24 ${
                currentStep >= 3 ? "bg-primary" : "bg-muted"
              }`}></div>
              <div className={`rounded-full flex items-center justify-center w-8 h-8 ${
                currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                3
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of 3
            </div>
          </div>
          
          <Tabs 
            value={`step-${currentStep}`} 
            onValueChange={(value) => setCurrentStep(parseInt(value.split("-")[1]))}
            className="w-full"
          >
            <TabsList className="hidden">
              <TabsTrigger value="step-1">Personal Details</TabsTrigger>
              <TabsTrigger value="step-2">Contact Information</TabsTrigger>
              <TabsTrigger value="step-3">Medical History</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <TabsContent value="step-1" className="m-0">
                <div className="health-card space-y-6">
                  <h2 className="text-xl font-semibold">Personal Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium">
                        Full Name <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="fullName"
                        className="health-input w-full"
                        placeholder="Enter patient name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="text-sm font-medium">
                        Date of Birth <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        className="health-input w-full"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="gender" className="text-sm font-medium">
                        Gender <span className="text-health-danger">*</span>
                      </label>
                      <select 
                        id="gender" 
                        className="health-input w-full"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bloodGroup" className="text-sm font-medium">
                        Blood Group
                      </label>
                      <select id="bloodGroup" className="health-input w-full">
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="maritalStatus" className="text-sm font-medium">
                        Marital Status
                      </label>
                      <select id="maritalStatus" className="health-input w-full">
                        <option value="">Select Marital Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="widowed">Widowed</option>
                        <option value="divorced">Divorced</option>
                        <option value="separated">Separated</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="occupation" className="text-sm font-medium">
                        Occupation
                      </label>
                      <input
                        id="occupation"
                        className="health-input w-full"
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => moveToStep(2)}>
                      Next Step
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="step-2" className="m-0">
                <div className="health-card space-y-6">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="phone"
                        className="health-input w-full"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="altPhone" className="text-sm font-medium">
                        Alternate Phone
                      </label>
                      <input
                        id="altPhone"
                        className="health-input w-full"
                        placeholder="Enter alternate phone"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Address <span className="text-health-danger">*</span>
                      </label>
                      <textarea
                        id="address"
                        className="health-input w-full h-24 resize-none"
                        placeholder="Enter full address"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium">
                        City <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="city"
                        className="health-input w-full"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="state" className="text-sm font-medium">
                        State <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="state"
                        className="health-input w-full"
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="emergencyContact" className="text-sm font-medium">
                        Emergency Contact Name
                      </label>
                      <input
                        id="emergencyContact"
                        className="health-input w-full"
                        placeholder="Enter emergency contact"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="emergencyPhone" className="text-sm font-medium">
                        Emergency Contact Phone
                      </label>
                      <input
                        id="emergencyPhone"
                        className="health-input w-full"
                        placeholder="Enter emergency phone"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => moveToStep(1)}
                    >
                      Previous Step
                    </Button>
                    <Button type="button" onClick={() => moveToStep(3)}>
                      Next Step
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="step-3" className="m-0">
                <div className="health-card space-y-6">
                  <h2 className="text-xl font-semibold">Medical Information</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="allergies" className="text-sm font-medium">
                        Known Allergies
                      </label>
                      <textarea
                        id="allergies"
                        className="health-input w-full h-16 resize-none"
                        placeholder="List any known allergies"
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="currentMedications" className="text-sm font-medium">
                        Current Medications
                      </label>
                      <textarea
                        id="currentMedications"
                        className="health-input w-full h-16 resize-none"
                        placeholder="List current medications"
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="chronicConditions" className="text-sm font-medium">
                        Chronic Conditions
                      </label>
                      <textarea
                        id="chronicConditions"
                        className="health-input w-full h-16 resize-none"
                        placeholder="List any chronic conditions"
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="height" className="text-sm font-medium">
                          Height (cm)
                        </label>
                        <input
                          id="height"
                          type="number"
                          className="health-input w-full"
                          placeholder="Enter height in cm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="weight" className="text-sm font-medium">
                          Weight (kg)
                        </label>
                        <input
                          id="weight"
                          type="number"
                          className="health-input w-full"
                          placeholder="Enter weight in kg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        ID Documents
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="aadharNumber" className="text-sm font-medium">
                            Aadhar Number
                          </label>
                          <input
                            id="aadharNumber"
                            className="health-input w-full"
                            placeholder="Enter Aadhar number"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="otherIdType" className="text-sm font-medium">
                            Other ID Type
                          </label>
                          <select id="otherIdType" className="health-input w-full">
                            <option value="">Select ID Type</option>
                            <option value="voterid">Voter ID</option>
                            <option value="passport">Passport</option>
                            <option value="drivingLicense">Driving License</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="otherIdNumber" className="text-sm font-medium">
                            ID Number
                          </label>
                          <input
                            id="otherIdNumber"
                            className="health-input w-full"
                            placeholder="Enter ID number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => moveToStep(2)}
                    >
                      Previous Step
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-5 w-5" />
                      Register Patient
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default NewPatient;
