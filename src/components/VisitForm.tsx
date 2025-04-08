import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VisitForm() {
    const location = useLocation();
    const regNo = location.state?.regNo; // Extract regNo from location state
    console.log(regNo);

    const [visitData, setVisitData] = useState({
        investigation: '',
        treatmentGiven: ''
    });

    const handleChange = (e) => {
        setVisitData({ ...visitData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`https://health-link-backend.vercel.app/${regNo}/visits`, visitData);
            alert("Visit added successfully");
            setVisitData({ investigation: "", treatmentGiven: "" });
        } catch (err) {
            console.error(err);
            alert("Error adding visit");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Add Visit Record for RegNo: {regNo}</h2>
            <input
                type="text"
                name="investigation"
                placeholder="Investigation Details"
                value={visitData.investigation}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700"
            />
            <input
                type="text"
                name="treatmentGiven"
                placeholder="Treatment Given"
                value={visitData.treatmentGiven}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700"
            />
            <button type="submit" className="bg-blue-600 p-2 rounded">Add Visit</button>
        </form>
    );
}