import { useParams } from "react-router-dom";

const PatientDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Patient Details</h1>
      <p>Patient ID: {id}</p>
      {/* Add logic to fetch and display patient data */}
    </div>
  );
};

export default PatientDetails;
