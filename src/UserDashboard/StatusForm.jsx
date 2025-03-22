import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const StatusForm = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [requestDetails, setRequestDetails] = useState(null); // Store all request details
  const [error, setError] = useState('');

  const checkStatus = async (e) => {
    e.preventDefault(); // Prevent form refresh
    setError(''); // Clear previous errors
    setRequestDetails(null); // Clear previous details

    if (!vehicleNumber) {
      setError('Please enter a vehicle number.');
      return;
    }

    try {
      // Query to fetch the request by vehicle number
      const requestsRef = collection(db, 'tollPassRequests');
      const q = query(requestsRef, where('vehicleNumber', '==', vehicleNumber)); // Use 'vehicleNumber' as a field in the query

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Retrieve the request details from Firestore
        const requestData = querySnapshot.docs[0].data();
        setRequestDetails(requestData);
      } else {
        setError('No request found for this vehicle number.');
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Check Toll Pass Status</h2>
      <form onSubmit={checkStatus} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Check Status
        </button>
      </form>
      
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {requestDetails && (
        <div className="mt-4">
          <h3 className="font-semibold">Request Details:</h3>
          <p><strong>Vehicle Number:</strong> {requestDetails.vehicleNumber}</p>
          <p><strong>From:</strong> {requestDetails.from}</p>
          <p><strong>To:</strong> {requestDetails.to}</p>
          <p><strong>Date:</strong> {requestDetails.date}</p>
          <p><strong>Status:</strong> {requestDetails.status}</p>
        </div>
      )}
    </div>
  );
};

export default StatusForm;
