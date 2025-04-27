import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');  
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container-signup">
  <div className="signup-box">
    <h1>Sign Up</h1>
    <form onSubmit={handleSubmit}>
      <label>Full Name</label>
      <input
        type="text"
        name="fullname"
        placeholder="Enter your name"
        value={form.fullname}
        onChange={handleChange}
        required
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label>Password</label>
      <input
        type="password"
        name="password"
        placeholder="Create a password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <label>Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Re-enter password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign Up</button>
    </form>

    <div>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  </div>
</div>

  );
};

export default Signup;
import './Signup.css';


