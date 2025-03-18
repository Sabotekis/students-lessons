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
      navigate('/');
      window.location.reload();
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <style>
        {`
          .login-form {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 100px;
          }

          .login-form input {
            margin: 10px 0;
            padding: 10px;
            width: 300px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          .login-form button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
          }

          .login-form button:hover {
            background-color: #45a049;
          }

          .error {
            color: red;
            margin-top: 10px;
          }
        `}
      </style>
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
        <button onClick={() => navigate('/')}>Back to Home</button>
      </form>
    </div>
  );
};

export default Login;