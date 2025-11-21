import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
              const res = await axios.post("https://lms-backend-5s5x.onrender.com/api/auth/signup", { ...form, role: "student" });
      setMessage(res.data.message || "Signup successful!");
      // Store token and user info as needed
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.reload(); // Force Navbar to update
      }
      setTimeout(() => {
        navigate("/");
      }, 1000); // Navigate to home after 1 second
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 font-inter animate-fadeIn"
      style={{
        background: 'radial-gradient(circle at 10% 20%, #ede9fe, #d1c4e9, #c4b5fd)',
      }}
    >
      <div
        className="bg-white/95"
        style={{
          backdropFilter: 'blur(12px)',
          padding: '40px 30px',
          borderRadius: '16px',
          boxShadow: '0 12px 36px rgba(86, 36, 208, 0.18)',
          maxWidth: '430px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          animation: 'slideIn 0.7s ease-out',
          transition: 'transform 0.3s, box-shadow 0.3s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.01)';
          e.currentTarget.style.boxShadow = '0 14px 40px rgba(86, 36, 208, 0.25)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 12px 36px rgba(86, 36, 208, 0.18)';
        }}
      >
        <h2
          style={{
            fontSize: '2.2rem',
            color: '#5624d0',
            fontWeight: 700,
            marginBottom: '24px',
            textShadow: '0 2px 4px rgba(86, 36, 208, 0.1)',
          }}
        >
          Create Your Account
        </h2>
        <form
          className="flex flex-col"
          style={{
            gap: '18px',
            marginBottom: '20px',
          }}
          onSubmit={handleSubmit}
        >
          <div
            className="flex items-center"
            style={{
              background: '#f3f0ff',
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '10px 14px',
              transition: 'border 0.3s ease',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = '#7c3aed')}
            onMouseOut={e => (e.currentTarget.style.borderColor = '#ccc')}
          >
            <i
              className="fas fa-user"
              style={{
                color: '#7c3aed',
                fontSize: '1.1rem',
              }}
            ></i>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="flex-1 border-none outline-none bg-transparent"
              style={{
                fontSize: '1rem',
                color: '#333',
                marginLeft: '10px',
              }}
              required
            />
          </div>
          <div
            className="flex items-center"
            style={{
              background: '#f3f0ff',
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '10px 14px',
              transition: 'border 0.3s ease',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = '#7c3aed')}
            onMouseOut={e => (e.currentTarget.style.borderColor = '#ccc')}
          >
            <i
              className="fas fa-envelope"
              style={{
                color: '#7c3aed',
                fontSize: '1.1rem',
              }}
            ></i>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="flex-1 border-none outline-none bg-transparent"
              style={{
                fontSize: '1rem',
                color: '#333',
                marginLeft: '10px',
              }}
              required
            />
          </div>
          <div
            className="flex items-center"
            style={{
              background: '#f3f0ff',
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '10px 14px',
              transition: 'border 0.3s ease',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = '#7c3aed')}
            onMouseOut={e => (e.currentTarget.style.borderColor = '#ccc')}
          >
            <i
              className="fas fa-lock"
              style={{
                color: '#7c3aed',
                fontSize: '1.1rem',
              }}
            ></i>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="flex-1 border-none outline-none bg-transparent"
              style={{
                fontSize: '1rem',
                color: '#333',
                marginLeft: '10px',
              }}
              required
            />
          </div>
          {/* Remove the role dropdown UI */}
          <button
            type="submit"
            style={{
              background: 'linear-gradient(to right, #5624d0, #7c3aed)',
              color: 'white',
              padding: '12px 16px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'transform 0.3s, background 0.3s',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
            }}
            disabled={loading}
            onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(to right, #7c3aed, #5624d0)')}
            onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(to right, #5624d0, #7c3aed)')}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {message && <div style={{ color: message.includes("success") ? "green" : "red", marginBottom: 10 }}>{message}</div>}
        <p
          style={{
            fontSize: '0.9rem',
            color: '#555',
          }}
        >
          Already have an account?{' '}
          <a
            href="/login"
            style={{
              color: '#5624d0',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;