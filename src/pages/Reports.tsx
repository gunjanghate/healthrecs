
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ArrowDown, Calendar, FileDown, FilePlus, Filter, Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  
  const generateReport = (reportType: string) => {
    setIsGenerating(true);
    setGeneratedReport(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport(reportType);
    }, 2000);
  };

  return (
    <Layout allowedRoles={["admin", "doctor"]}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and view medical reports
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Today
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="w-full max-w-lg mx-auto grid grid-cols-3 mb-8">
            <TabsTrigger value="summary">Summary Reports</TabsTrigger>
            <TabsTrigger value="patient">Patient Reports</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="health-card health-card-hover">
                <h3 className="text-lg font-semibold mb-2">Monthly Patient Summary</h3>
                <p className="text-muted-foreground mb-6">
                  Overview of patient visits and registrations for the current month
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Last Generated: 2 days ago
                  </div>
                  <Button onClick={() => generateReport("Monthly Patient Summary")}>
                    Generate
                  </Button>
                </div>
              </div>
              
              <div className="health-card health-card-hover">
                <h3 className="text-lg font-semibold mb-2">Disease Distribution</h3>
                <p className="text-muted-foreground mb-6">
                  Analysis of diseases diagnosed in the last 30 days
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Last Generated: 5 days ago
                  </div>
                  <Button onClick={() => generateReport("Disease Distribution")}>
                    Generate
                  </Button>
                </div>
              </div>
              
              <div className="health-card health-card-hover">
                <h3 className="text-lg font-semibold mb-2">Treatment Effectiveness</h3>
                <p className="text-muted-foreground mb-6">
                  Follow-up statistics and treatment effectiveness reports
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Last Generated: 1 week ago
                  </div>
                  <Button onClick={() => generateReport("Treatment Effectiveness")}>
                    Generate
                  </Button>
                </div>
              </div>
              
              <div className="health-card health-card-hover">
                <h3 className="text-lg font-semibold mb-2">Medication Usage</h3>
                <p className="text-muted-foreground mb-6">
                  Summary of medications prescribed and their usage
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Last Generated: 2 weeks ago
                  </div>
                  <Button onClick={() => generateReport("Medication Usage")}>
                    Generate
                  </Button>
                </div>
              </div>
              
              <div className="health-card health-card-hover">
                <h3 className="text-lg font-semibold mb-2">Patient Demographics</h3>
                <p className="text-muted-foreground mb-6">
                  Analysis of patient age, gender, and location distribution
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Last Generated: 3 weeks ago
                  </div>
                  <Button onClick={() => generateReport("Patient Demographics")}>
                    Generate
                  </Button>
                </div>
              </div>
              
              <div className="health-card health-card-hover border-dashed">
                <h3 className="text-lg font-semibold mb-2">Create Custom Report</h3>
                <p className="text-muted-foreground mb-6">
                  Define parameters and generate a custom summary report
                </p>
                <Button className="w-full" variant="outline">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="patient" className="space-y-8">
            <div className="health-card">
              <h3 className="text-lg font-semibold mb-6">Patient-specific Reports</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="patientSearch" className="text-sm font-medium">
                    Search Patient
                  </label>
                  <div className="relative">
                    <input
                      id="patientSearch"
                      className="health-input w-full pl-10"
                      placeholder="Enter patient name, ID or registration number"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="health-card health-card-hover">
                    <h4 className="font-medium mb-2">Medical History</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete medical history and visit records
                    </p>
                    <Button size="sm" className="w-full" onClick={() => generateReport("Patient Medical History")}>
                      Generate
                    </Button>
                  </div>
                  
                  <div className="health-card health-card-hover">
                    <h4 className="font-medium mb-2">Treatment Summary</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Summary of all treatments and medications
                    </p>
                    <Button size="sm" className="w-full" onClick={() => generateReport("Patient Treatment Summary")}>
                      Generate
                    </Button>
                  </div>
                  
                  <div className="health-card health-card-hover">
                    <h4 className="font-medium mb-2">Medical Certificate</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Official medical certificate for the patient
                    </p>
                    <Button size="sm" className="w-full" onClick={() => generateReport("Medical Certificate")}>
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-8">
            <div className="health-card">
              <h3 className="text-lg font-semibold mb-6">Custom Report Builder</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="reportType" className="text-sm font-medium">
                      Report Type
                    </label>
                    <select id="reportType" className="health-input w-full">
                      <option value="">Select Report Type</option>
                      <option value="patient">Patient Reports</option>
                      <option value="diagnosis">Diagnosis Reports</option>
                      <option value="treatment">Treatment Reports</option>
                      <option value="medication">Medication Reports</option>
                      <option value="staff">Staff Performance</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="reportFormat" className="text-sm font-medium">
                      Report Format
                    </label>
                    <select id="reportFormat" className="health-input w-full">
                      <option value="pdf">PDF Document</option>
                      <option value="excel">Excel Spreadsheet</option>
                      <option value="csv">CSV File</option>
                      <option value="print">Print Friendly</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      className="health-input w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      className="health-input w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Include Fields</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="field1" defaultChecked />
                      <label htmlFor="field1" className="text-sm">Patient Info</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="field2" defaultChecked />
                      <label htmlFor="field2" className="text-sm">Diagnosis</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="field3" defaultChecked />
                      <label htmlFor="field3" className="text-sm">Treatments</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="field4" defaultChecked />
                      <label htmlFor="field4" className="text-sm">Medications</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="field5" />
                      <label htmlFor="field5" className="text-sm">Lab Results</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="field6" />
                      <label htmlFor="field6" className="text-sm">Follow-ups</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="field7" />
                      <label htmlFor="field7" className="text-sm">Billing Info</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="field8" />
                      <label htmlFor="field8" className="text-sm">Staff Notes</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button variant="outline">
                    Save Template
                  </Button>
                  <Button onClick={() => generateReport("Custom Report")}>
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {isGenerating && (
          <div className="health-card p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg font-medium">Generating report...</p>
              <p className="text-muted-foreground">
                This may take a few moments. Please wait.
              </p>
            </div>
          </div>
        )}
        
        {generatedReport && (
          <div className="health-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{generatedReport}</h3>
              <p className="text-sm text-muted-foreground">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-6 mb-6 bg-muted/50">
              <div className="text-center">
                <p className="text-xl font-bold mb-2">Sita Ratan Leprosy Hospital, Anandwan</p>
                <p className="mb-4">{generatedReport}</p>
                <div className="border-t border-border my-4"></div>
                <p className="text-sm text-muted-foreground">
                  This is a preview of the generated report. Download or print for the complete version.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button>
                <FileDown className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
