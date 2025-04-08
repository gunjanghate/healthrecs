import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Home, 
  Calendar, 
  Activity, 
  Clipboard, 
  FileText,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define patient interface based on API response
interface Patient {
  _id: string;
  regNo: string;
  name: string;
  dob: string;
  age: number;
  sex: string;
  caste: string;
  mobileNo: string;
  aadharNo: string;
  address: string;
  dateOfAdmission: string;
  mothersName: string;
  relatives: string;
  bloodGroup: string;
  mbOrPbStatus: string;
  deformityStatus: string;
  durationOfDisease: string;
  previousOccupation: string;
  disablitiyStatus: string;
  otherAilments: {
    hypertension?: boolean;
    ischemicHeartDisease?: boolean;
    bronchialAsthma?: boolean;
    cancer?: boolean;
    tuberculosis?: boolean;
    parkinsons?: boolean;
    bph?: boolean;
    tkr?: boolean;
    skinDisease?: boolean;
    relapse?: boolean;
    majorSurgery?: boolean;
    [key: string]: boolean | undefined;
  };
  visits: Array<{
    date: string | null;
    investigation: string;
    treatmentGiven: string;
    _id: string;
  }>;
  createdAt: string;
  __v: number;
}

// Function to determine patient condition based on ailments
const determineCondition = (patient: Patient): "critical" | "followup" | "stable" => {
  if (!patient.otherAilments) return "stable";
  
  // Critical conditions
  if (
    patient.otherAilments.cancer || 
    patient.otherAilments.tuberculosis || 
    patient.otherAilments.ischemicHeartDisease
  ) {
    return "critical";
  }
  
  // Follow-up conditions
  if (
    patient.otherAilments.hypertension || 
    patient.otherAilments.parkinsons ||
    patient.otherAilments.majorSurgery ||
    patient.otherAilments.relapse
  ) {
    return "followup";
  }
  
  // Default to stable
  return "stable";
};

// Label map for better display of ailment names
const ailmentLabels: Record<string, string> = {
  hypertension: "Hypertension",
  ischemicHeartDisease: "Ischemic Heart Disease",
  bronchialAsthma: "Bronchial Asthma",
  cancer: "Cancer",
  tuberculosis: "Tuberculosis",
  parkinsons: "Parkinson's Disease",
  bph: "Benign Prostatic Hyperplasia",
  tkr: "Total Knee Replacement",
  skinDisease: "Skin Disease",
  relapse: "Relapse",
  majorSurgery: "Major Surgery"
};

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://health-link-backend.vercel.app/record/${id}`);
        setPatient(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError("Failed to load patient data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not recorded";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getConditionBadge = (condition: "critical" | "followup" | "stable") => {
    switch (condition) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "followup":
        return <Badge className="bg-yellow-500">Follow-up</Badge>;
      case "stable":
        return <Badge className="bg-green-500">Stable</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg">Loading patient data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Patient</h1>
          <p className="text-muted-foreground mb-4">{error || "Patient not found"}</p>
          <Button onClick={() => navigate("/patients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </div>
      </Layout>
    );
  }

  const patientCondition = determineCondition(patient);
  const activeAilments = Object.entries(patient.otherAilments || {})
    .filter(([_, value]) => value)
    .map(([key]) => key);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/patients")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline">Print Summary</Button>
            <Button>Edit Patient</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Overview Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Patient Profile
                {getConditionBadge(patientCondition)}
              </CardTitle>
              <CardDescription>
                Patient ID: {patient.regNo}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-lg">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.age} years, {patient.sex === "M" ? "Male" : patient.sex === "F" ? "Female" : "Other"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p>{patient.mobileNo || "Not provided"}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Home className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p>{patient.address || "Not provided"}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Admission Date</p>
                  <p>{formatDate(patient.dateOfAdmission)}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm font-medium mb-2">Blood Group</p>
                <Badge variant="outline" className="text-sm">
                  {patient.bloodGroup || "Not recorded"}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">MB/PB Status</p>
                <Badge variant="outline" className="text-sm">
                  {patient.mbOrPbStatus || "Not recorded"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Card className="md:col-span-2">
            <Tabs defaultValue="medical" className="w-full">
              <CardHeader className="pb-0">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="medical">Medical Info</TabsTrigger>
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="visits">Visit History</TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent className="pt-6">
                <TabsContent value="medical" className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-muted-foreground" />
                      Medical Conditions
                    </h3>
                    
                    {activeAilments.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {activeAilments.map(ailment => (
                          <div key={ailment} className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={
                                ailment === "cancer" || ailment === "tuberculosis" || ailment === "ischemicHeartDisease"
                                  ? "text-red-500 border-red-200 bg-red-50"
                                  : ailment === "hypertension" || ailment === "parkinsons" || ailment === "relapse"
                                    ? "text-yellow-500 border-yellow-200 bg-yellow-50"
                                    : "text-green-500 border-green-200 bg-green-50"
                              }
                            >
                              {ailmentLabels[ailment] || ailment}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No medical conditions recorded</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Duration of Disease</h3>
                      <p>{patient.durationOfDisease || "Not recorded"}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Deformity Status</h3>
                      <p>{patient.deformityStatus || "Not recorded"}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Disability Status</h3>
                      <p>{patient.disablitiyStatus || "Not recorded"}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium">Date of Birth</h3>
                      <p>{formatDate(patient.dob)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Caste</h3>
                      <p>{patient.caste || "Not recorded"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Mother's Name</h3>
                      <p>{patient.mothersName || "Not recorded"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Aadhar Number</h3>
                      <p>{patient.aadharNo || "Not recorded"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Relatives</h3>
                      <p>{patient.relatives || "Not recorded"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Previous Occupation</h3>
                      <p>{patient.previousOccupation || "Not recorded"}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="visits" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center">
                      <Clipboard className="h-5 w-5 mr-2 text-muted-foreground" />
                      Visit History
                    </h3>
                    
                    <Button size="sm">
                      Add New Visit
                    </Button>
                  </div>
                  
                  {patient.visits && patient.visits.length > 0 ? (
                    <div className="space-y-4">
                      {patient.visits.map((visit, index) => (
                        <Card key={visit._id || index}>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base flex justify-between items-center">
                              <span>Visit {index + 1}</span>
                              <span>{formatDate(visit.date)}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-3 space-y-3">
                            <div>
                              <h4 className="text-sm font-medium">Investigation</h4>
                              <p>{visit.investigation || "No investigation details recorded"}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium">Treatment Given</h4>
                              <p>{visit.treatmentGiven || "No treatment details recorded"}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                      <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No visit records found</p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetails;