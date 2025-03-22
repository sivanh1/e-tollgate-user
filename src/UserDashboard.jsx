import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const UserDashboard = () => {
  // State for tab selection: "request" or "status"
  const [activeTab, setActiveTab] = useState("request");

  // Request Toll Pass Form states
  const [driverName, setDriverName] = useState('');
  // Single input for the full vehicle number in Request form
  const [requestVehicleNumber, setRequestVehicleNumber] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [status] = useState('Pending'); // Default status for user request

  // Vehicle type and toll amount
  const [vehicleType, setVehicleType] = useState('Bike');
  const [tollAmount, setTollAmount] = useState(200);

  // Check Status Form state (separate from request form)
  const [statusVehicleNumber, setStatusVehicleNumber] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);
  const [error, setError] = useState('');

  // Auto-calculate toll amount based on vehicle type
  useEffect(() => {
    let amount = 0;
    if (vehicleType === 'Bike') {
      amount = 200;
    } else if (vehicleType === 'Car') {
      amount = 300;
    } else if (vehicleType === 'Bus') {
      amount = 400;
    } else if (vehicleType === 'Lorry') {
      amount = 500;
    }
    setTollAmount(amount);
  }, [vehicleType]);

  // Handle Request Toll Pass submission
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    // Validate vehicle number using a regex: 2 letters, 2 digits, 1 letter, 4 digits (spaces optional)
    const pattern = /^[A-Za-z]{2}\s?[0-9]{2}\s?[A-Za-z]{1}\s?[0-9]{4}$/;
    if (!pattern.test(requestVehicleNumber)) {
      alert('Please enter a valid vehicle number in the format: [2 letters] [2 digits] [1 letter] [4 digits].');
      return;
    }
    try {
      await addDoc(collection(db, 'tollPassRequests'), {
        driverName,
        vehicleNumber: requestVehicleNumber.toUpperCase(),
        from,
        to,
        date,
        status,
        vehicleType,
        tollAmount,
      });
      alert('Toll Pass Requested!');
      // Clear fields
      setDriverName('');
      setRequestVehicleNumber('');
      setFrom('');
      setTo('');
      setDate('');
      setVehicleType('Bike');
    } catch (err) {
      console.error("Error adding document: ", err);
      alert('Failed to request toll pass. Try again.');
    }
  };

  // Handle Check Status submission
  const checkStatus = async (e) => {
    e.preventDefault();
    setError('');
    setRequestDetails(null);
    if (!statusVehicleNumber) {
      setError('Please enter a vehicle number.');
      return;
    }
    try {
      const requestsRef = collection(db, 'tollPassRequests');
      const q = query(requestsRef, where('vehicleNumber', '==', statusVehicleNumber));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
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
    <div
      style={{
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f7f7f7',
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '2rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
        }}
      >
        {activeTab === 'request' && (
          <div style={{ marginBottom: '2rem' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#202124'
              }}
            >
              Request Toll Pass
            </h2>
            <form
              onSubmit={handleRequestSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <input
                type="text"
                placeholder="Driver Name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px',
                  backgroundColor: "white",
                  color: "black"
                }}
                required
              />
              <input
                type="text"
                placeholder="Vehicle Number (e.g., TN 56 C 2345)"
                value={requestVehicleNumber}
                onChange={(e) => setRequestVehicleNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px',
                  textTransform: 'uppercase',
                  backgroundColor: "white",
                  color: "black"
                }}
                required
              />
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px',
                  backgroundColor: "white",
                  color: "black"
                }}
                required
              >
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Bus">Bus</option>
                <option value="Lorry">Lorry</option>
              </select>
              <input
                type="text"
                value={`Toll: ${tollAmount}`}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px',
                  backgroundColor: "#f1f1f1",
                  color: "black"
                }}
              />
              <input
                type="text"
                placeholder="From"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px',
                  backgroundColor: "white",
                  color: "black"
                }}
                required
              />
              <input
                type="text"
                placeholder="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px',
                  backgroundColor: "white",
                  color: "black"
                }}
                required
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px',
                  backgroundColor: "white",
                  color: "black"
                }}
                required
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#34b7f1',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                Request Toll Pass
              </button>
            </form>
          </div>
        )}

        {activeTab === 'status' && (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#202124'
            }}>
              Check Toll Pass Status
            </h2>
            <form onSubmit={checkStatus} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <input
                type="text"
                placeholder="Enter Vehicle Number"
                value={statusVehicleNumber}
                onChange={(e) => setStatusVehicleNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px'
                }}
                required
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#34b7f1',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                Check Status
              </button>
            </form>
            {error && (
              <p style={{ color: '#D32F2F', marginTop: '1rem', fontSize: '16px' }}>
                {error}
              </p>
            )}
            {requestDetails && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#f4f6f8'
              }}>
                <h3 style={{ fontWeight: '600', color: '#202124' }}>
                  Request Details:
                </h3>
                <p style={{ fontWeight: '600', color: '#202124' }}>
                  <strong>Vehicle Number:</strong> {requestDetails.vehicleNumber}
                </p>
                <p style={{ fontWeight: '600', color: '#202124' }}>
                  <strong>From:</strong> {requestDetails.from}
                </p>
                <p style={{ fontWeight: '600', color: '#202124' }}>
                  <strong>To:</strong> {requestDetails.to}
                </p>
                <p style={{ fontWeight: '600', color: '#202124' }}>
                  <strong>Date:</strong> {requestDetails.date}
                </p>
                <p style={{ fontWeight: '600', color: '#202124' }}>
                  <strong>Status:</strong> {requestDetails.status}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('request')}
            style={{
              padding: '0.8rem 1rem',
              backgroundColor: activeTab === 'request' ? '#34b7f1' : '#e0e0e0',
              color: activeTab === 'request' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Request Toll Pass
          </button>
          <button
            onClick={() => setActiveTab('status')}
            style={{
              padding: '0.8rem 1rem',
              backgroundColor: activeTab === 'status' ? '#34b7f1' : '#e0e0e0',
              color: activeTab === 'status' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Check Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
