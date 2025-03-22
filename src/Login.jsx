import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const LoginRegister = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // true = login mode, false = register mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin(); // Trigger on successful login/registration
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={loginContainerStyle}>
      <div style={cardStyle}>
        <h2 style={headerStyle}>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={inputContainerStyle}>
            <label style={labelStyle}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          {!isLogin && (
            <div style={inputContainerStyle}>
              <label style={labelStyle}>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          )}
          <button type="submit" style={buttonStyle}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        {error && <p style={errorStyle}>{error}</p>}
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={toggleButtonStyle}
          >
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for the login/register screen
const loginContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  minWidth: '100vw',
  backgroundColor: '#e9ecef',
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '40px',
  borderRadius: '15px',
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '450px',
  textAlign: 'center',
};

const headerStyle = {
  fontSize: '26px',
  marginBottom: '25px',
  color: '#333',
  fontWeight: '600',
};

const inputContainerStyle = {
  marginBottom: '20px',
  textAlign: 'left',
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#555',
  marginBottom: '5px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '5px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '16px',
  backgroundColor: '#f7f7f7',
  transition: 'border 0.3s ease',
  color: 'black'
};

const buttonStyle = {
  padding: '14px 0',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '18px',
  cursor: 'pointer',
  width: '100%',
  marginTop: '15px',
  transition: 'background-color 0.3s ease',
};

const errorStyle = {
  color: '#D32F2F',
  marginTop: '10px',
  fontSize: '14px',
};

const toggleButtonStyle = {
  padding: '10px 15px',
  backgroundColor: 'black',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px',
};

export default LoginRegister;
