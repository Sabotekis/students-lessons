import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' 
      });
  
      const data = await response.json(); 
  
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      alert("Login successful");
      navigate('/protected');
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };
  

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default Login;

