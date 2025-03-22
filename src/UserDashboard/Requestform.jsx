import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const RequestForm = () => {
  // Form states
  const [driverName, setDriverName] = useState('');
  // Vehicle number parts
  const [stateCode, setStateCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [series, setSeries] = useState('');
  const [uniqueNumber, setUniqueNumber] = useState('');
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Pending'); // default status for user request
  
  // Vehicle type and toll amount
  const [vehicleType, setVehicleType] = useState('Bike');
  const [tollAmount, setTollAmount] = useState(200);

  // Auto-calculate toll amount when vehicleType changes
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate vehicle number parts (2 letters, 2 digits, 1 letter, 4 digits)
    if (
      stateCode.length !== 2 ||
      districtCode.length !== 2 ||
      series.length !== 1 ||
      uniqueNumber.length !== 4
    ) {
      alert('Please enter a valid vehicle number in the format: [2 letters] [2 digits] [1 letter] [4 digits].');
      return;
    }
    // Combine parts into one full vehicle number
    const fullVehicleNumber = `${stateCode.toUpperCase()} ${districtCode} ${series.toUpperCase()} ${uniqueNumber}`;
    try {
      await addDoc(collection(db, 'tollPassRequests'), {
        driverName,
        vehicleNumber: fullVehicleNumber,
        from,
        to,
        date,
        status,
        vehicleType,
        tollAmount
      });
      alert('Toll Pass Requested Successfully!');
      // Clear form fields
      setDriverName('');
      setStateCode('');
      setDistrictCode('');
      setSeries('');
      setUniqueNumber('');
      setFrom('');
      setTo('');
      setDate('');
      setVehicleType('Bike');
      setStatus('Pending');
    } catch (err) {
      console.error('Error adding document: ', err);
      alert('Failed to request toll pass. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Driver Name"
        value={driverName}
        onChange={(e) => setDriverName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="State Code"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
          maxLength="2"
          className="w-1/4 p-2 border rounded uppercase"
          required
        />
        <input
          type="text"
          placeholder="District Code"
          value={districtCode}
          onChange={(e) => setDistrictCode(e.target.value)}
          maxLength="2"
          className="w-1/4 p-2 border rounded uppercase"
          required
        />
        <input
          type="text"
          placeholder="Series"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          maxLength="1"
          className="w-1/4 p-2 border rounded uppercase"
          required
        />
        <input
          type="text"
          placeholder="Unique No."
          value={uniqueNumber}
          onChange={(e) => setUniqueNumber(e.target.value)}
          maxLength="4"
          className="w-1/4 p-2 border rounded uppercase"
          required
        />
      </div>
      <select
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
        className="w-full p-2 border rounded"
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
        className="w-full p-2 border rounded bg-gray-100"
      />
      <input
        type="text"
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Declined">Declined</option>
      </select>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Request Toll Pass
      </button>
    </form>
  );
};

export default RequestForm;
