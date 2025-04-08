import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function VisitForm() {
  const { id } = useParams(); // Get regNo from URL
  const [visitData, setVisitData] = useState({
    investigation: '',
    treatmentGiven: ''
  });

  const handleChange = (e) => {
    setVisitData({ ...visitData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      alert("Registration number is missing in the URL.");
      return;
    }
    try {
      await axios.post(`https://health-link-backend.vercel.app/${id}/visits`, visitData);
      alert("Visit added successfully");
      setVisitData({ investigation: "", treatmentGiven: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding visit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow-md max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-2">Add Visit Record for RegNo: {id}</h2>
      <input
        type="text"
        name="investigation"
        placeholder="Investigation Details"
        value={visitData.investigation}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="treatmentGiven"
        placeholder="Treatment Given"
        value={visitData.treatmentGiven}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Visit
      </button>
    </form>
  );
}

