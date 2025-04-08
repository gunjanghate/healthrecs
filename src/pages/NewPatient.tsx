import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clipboard, FileText, Save, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from 'axios';

const NewPatient = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    regNo: '',
    name: '',
    dob: '',
    age: '',
    sex: '',
    caste: '',
    mobileNo: '',
    aadharNo: '',
    address: '',
    dateOfAdmission: '',
    mothersName: '',
    relatives: '',
    bloodGroup: '',
    mbOrPbStatus: '',
    deformityStatus: '',
    durationOfDisease: '',
    previousOccupation: '',
    disablitiyStatus: '',
    otherAilments: {},
    visits: [{ date: '', investigation: '', treatmentGiven: '' }]
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAilmentChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      otherAilments: { ...formData.otherAilments, [name]: checked }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://health-link-backend.vercel.app/newRecord', formData);
      console.log(response.data);
      
      // Show success toast
      toast.success("Patient registered successfully!", {
        description: "The patient has been added to the system.",
        duration: 5000,
      });
      
      setFormSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error("Registration failed", {
        description: "There was an error registering the patient. Please try again.",
        duration: 5000,
      });
    }
  };
  
  const moveToStep = (step) => {
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
                  The patient has been successfully registered in the system with Registration No: {formData.regNo}
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
                      <label htmlFor="regNo" className="text-sm font-medium">
                        Registration No <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="regNo"
                        name="regNo"
                        value={formData.regNo}
                        onChange={handleChange}
                        className="health-input w-full"
                        placeholder="Enter registration number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="health-input w-full"
                        placeholder="Enter patient name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="dob" className="text-sm font-medium">
                        Date of Birth <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        className="health-input w-full"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="age" className="text-sm font-medium">
                        Age <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        className="health-input w-full"
                        placeholder="Enter age"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="sex" className="text-sm font-medium">
                        Gender <span className="text-health-danger">*</span>
                      </label>
                      <select 
                        id="sex"
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        className="health-input w-full"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="caste" className="text-sm font-medium">
                        Caste
                      </label>
                      <input
                        id="caste"
                        name="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        className="health-input w-full"
                        placeholder="Enter caste"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bloodGroup" className="text-sm font-medium">
                        Blood Group
                      </label>
                      <select 
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="health-input w-full"
                      >
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
                      <label htmlFor="previousOccupation" className="text-sm font-medium">
                        Previous Occupation
                      </label>
                      <input
                        id="previousOccupation"
                        name="previousOccupation"
                        value={formData.previousOccupation}
                        onChange={handleChange}
                        className="health-input w-full"
                        placeholder="Enter previous occupation"
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
                      <label htmlFor="mobileNo" className="text-sm font-medium">
                        Phone Number <span className="text-health-danger">*</span>
                      </label>
                      <input
                        id="mobileNo"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleChange}
                        className="health-input w-full"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="aadharNo" className="text-sm font-medium">
                        Aadhar Number
                      </label>
                      <input
                        id="aadharNo"
                        name="aadharNo"
                        value={formData.aadharNo}
                        onChange={handleChange}
                        className="health-input w-full"
                        placeholder="Enter Aadhar number"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Address <span className="text-health-danger">*</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="health-input w-full h-24 resize-none"
                        placeholder="Enter full address"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="mothersName" className="text-sm font-medium">
                        Mother's Name
                      </label>
                      <input
                        id="mothersName"
                        name="mothersName"
                        value={formData.mothersName}
                        onChange={handleChange}
                        className="health-input w-full"
                        placeholder="Enter mother's name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="relatives" className="text-sm font-medium">
                        Relatives
                      </label>
                      <input
                        id="relatives"
                        name="relatives"
                        value={formData.relatives}
                        onChange={handleChange}
                        className="health-input w-full"
                        placeholder="Enter relatives"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="dateOfAdmission" className="text-sm font-medium">
                        Date of Admission
                      </label>
                      <input
                        id="dateOfAdmission"
                        name="dateOfAdmission"
                        type="date"
                        value={formData.dateOfAdmission}
                        onChange={handleChange}
                        className="health-input w-full"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="mbOrPbStatus" className="text-sm font-medium">
                          MB/PB Status
                        </label>
                        <input
                          id="mbOrPbStatus"
                          name="mbOrPbStatus"
                          value={formData.mbOrPbStatus}
                          onChange={handleChange}
                          className="health-input w-full"
                          placeholder="Enter MB/PB status"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="deformityStatus" className="text-sm font-medium">
                          Deformity Status
                        </label>
                        <input
                          id="deformityStatus"
                          name="deformityStatus"
                          value={formData.deformityStatus}
                          onChange={handleChange}
                          className="health-input w-full"
                          placeholder="Enter deformity status"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="durationOfDisease" className="text-sm font-medium">
                          Duration of Disease
                        </label>
                        <input
                          id="durationOfDisease"
                          name="durationOfDisease"
                          value={formData.durationOfDisease}
                          onChange={handleChange}
                          className="health-input w-full"
                          placeholder="Enter duration of disease"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="disablitiyStatus" className="text-sm font-medium">
                          Disability Status
                        </label>
                        <input
                          id="disablitiyStatus"
                          name="disablitiyStatus"
                          value={formData.disablitiyStatus}
                          onChange={handleChange}
                          className="health-input w-full"
                          placeholder="Enter disability status"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Other Ailments</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          'hypertension', 'diabetesMellitus', 'sickleCell', 'ischemicHeartDisease', 'bronchialAsthma',
                          'hiv', 'cancer', 'mentalIllness', 'filariasis', 'tuberculosis', 'hemorrhoids', 'epilepsy',
                          'paralysis', 'parkinsons', 'hypothyroidism', 'bph', 'renalDisease', 'tkr', 'itFemur',
                          'varicoseVeins', 'skinDisease', 'majorSurgery', 'relapse'
                        ].map((ailment) => (
                          <label key={ailment} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name={ailment}
                              checked={formData.otherAilments[ailment] || false}
                              onChange={handleAilmentChange}
                              className="health-checkbox"
                            />
                            <span className="text-sm">
                              {ailment.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </label>
                        ))}
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