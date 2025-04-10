import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Upload, FileImage, Check, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ImageUploadModal = ({ isOpen, onClose, setFormData }) => {
  const [image, setImage] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setJsonData(null);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://cep-backend.onrender.com/extract-data",
        formData
      );
      setJsonData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Error extracting data", {
        description: "Failed to extract data from the image. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseData = () => {
    if (!jsonData) return;
    
    // Map the extracted data to the form data structure
    const mappedData = {
      regNo: jsonData.registration_number || '',
      name: jsonData.name || '',
      dob: formatDateForInput(jsonData.date_of_birth) || '',
      age: jsonData.age ? jsonData.age.toString() : '',
      sex: mapGender(jsonData.sex) || '',
      caste: jsonData.caste || '',
      mobileNo: jsonData.mobile_number || '',
      aadharNo: jsonData.aadhar_number || '',
      address: jsonData.address || '',
      dateOfAdmission: formatDateForInput(jsonData.date_of_admission) || '',
      mothersName: jsonData["mother's_name"] || '',
      relatives: jsonData.relatives || '',
      bloodGroup: jsonData.blood_group || '',
      mbOrPbStatus: jsonData.leprosy_type || '',
      deformityStatus: jsonData.deformity_status || '',
      durationOfDisease: jsonData.duration_of_disease || '',
      previousOccupation: jsonData.previous_occupation || '',
      disablitiyStatus: '',
      otherAilments: {},
    };
    
    setFormData(mappedData);
    toast.success("Data imported successfully", {
      description: "The form has been populated with the extracted data. Please review and update if needed.",
    });
    onClose();
  };

  // Helper function to format dates from DD/MM/YYYY to YYYY-MM-DD for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    
    return `${year}-${month}-${day}`;
  };

  // Helper function to map gender values
  const mapGender = (gender) => {
    if (!gender) return '';
    const lowerGender = gender.toLowerCase();
    if (lowerGender.includes('male') || lowerGender === 'm') return 'M';
    if (lowerGender.includes('female') || lowerGender === 'f') return 'F';
    return '';
  };

  const resetModal = () => {
    setImage(null);
    setJsonData(null);
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Treatment Card Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {!jsonData ? (
            <>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer"
                   onClick={() => document.getElementById('file-input').click()}>
                <input 
                  id="file-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
                
                {preview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-64 object-contain rounded-md"
                    />
                    <span className="text-sm text-muted-foreground">Click to change image</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileImage className="h-10 w-10 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Click to select an image of the treatment card
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!image || loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Extract Data
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-success/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-success" />
                  <h3 className="font-medium">Data Extracted Successfully</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Review the extracted data below. If everything looks correct, click "Use This Data" to populate the form.
                </p>
              </div>
              
              <div className="max-h-64 overflow-y-auto border rounded-md">
                <pre className="p-4 text-sm">
                  {JSON.stringify(jsonData, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={resetModal}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          
          {jsonData && (
            <Button onClick={handleUseData}>
              <Check className="mr-2 h-4 w-4" />
              Use This Data
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;