import React, { useState, useRef } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";

const LANGUAGES = [
  "English (US)",
  "English (UK)",
  "Hindi",
  "Spanish",
  "French",
  "German",
  // Add more as needed
];

const EditProfileModal = ({ user, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState(user.firstName || user.name || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [headline, setHeadline] = useState(user.headline || "");
  const [bio, setBio] = useState(user.bio || "");
  const [language, setLanguage] = useState(user.language || LANGUAGES[0]);
  const [links, setLinks] = useState(user.links || {
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
    x: "",
    youtube: "",
  });
  const [photo, setPhoto] = useState(user.photoUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => setPhoto("");

  const handleLinkChange = (key, value) => {
    setLinks({ ...links, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const update = {
        firstName,
        lastName,
        name: firstName,
        headline,
        bio,
        language,
        links,
        photoUrl: photo,
      };
      const res = await axios.put(
        "https://lms-backend-5s5x.onrender.com/api/profile",
        update,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      setSuccess("Details updated successfully!");
      setTimeout(() => {
        setSuccess("");
        onSave(res.data);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.25)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          borderRadius: 16,
          maxWidth: 600,
          width: '100%',
          padding: 32,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          position: 'relative',
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 26,
            color: '#888',
            cursor: 'pointer',
            zIndex: 10,
          }}
          aria-label="Close"
        >
          <FiX />
        </button>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>Public profile</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 24 }}>Add information about yourself</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#222',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 700,
            overflow: 'hidden',
            position: 'relative',
            marginBottom: 8,
          }}>
            {photo ? (
              <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (firstName[0] || '').toUpperCase()
            )}
            <button
              type="button"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#fff',
                border: 'none',
                borderRadius: '50%',
                padding: 6,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
              title="Edit photo"
              onClick={() => fileInputRef.current.click()}
            >
              <span role="img" aria-label="camera" style={{ color: '#7c3aed', fontSize: 18 }}>📷</span>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
            {photo && (
              <button
                type="button"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  padding: 6,
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}
                title="Remove photo"
                onClick={handleRemovePhoto}
              >
                <span style={{ color: '#d32f2f', fontWeight: 700, fontSize: 14 }}>✕</span>
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600 }}>First Name</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600 }}>Last Name</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600 }}>Headline</label>
          <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} maxLength={60} style={inputStyle} />
          <div style={{ fontSize: 12, color: '#888', textAlign: 'right' }}>{headline.length}/60</div>
          <div style={{ fontSize: 12, color: '#888' }}>Add a professional headline like, "Instructor at Udemy" or "Architect."</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600 }}>Biography</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} placeholder="Biography" />
          <div style={{ fontSize: 12, color: '#888' }}>Links and coupon codes are not permitted in this section.</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600 }}>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle}>
            {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600 }}>Links:</label>
          <input type="text" value={links.website} onChange={e => handleLinkChange('website', e.target.value)} placeholder="Website (http(s)://..)" style={inputStyle} />
          <input type="text" value={links.facebook} onChange={e => handleLinkChange('facebook', e.target.value)} placeholder="facebook.com/ Username" style={inputStyle} />
          <input type="text" value={links.instagram} onChange={e => handleLinkChange('instagram', e.target.value)} placeholder="instagram.com/ Username" style={inputStyle} />
          <input type="text" value={links.linkedin} onChange={e => handleLinkChange('linkedin', e.target.value)} placeholder="linkedin.com/ Public Profile URL" style={inputStyle} />
          <input type="text" value={links.tiktok} onChange={e => handleLinkChange('tiktok', e.target.value)} placeholder="tiktok.com/ @Username" style={inputStyle} />
          <input type="text" value={links.x} onChange={e => handleLinkChange('x', e.target.value)} placeholder="x.com/ Username" style={inputStyle} />
          <input type="text" value={links.youtube} onChange={e => handleLinkChange('youtube', e.target.value)} placeholder="youtube.com/ Username" style={inputStyle} />
        </div>
        {success && <div style={{ color: 'green', marginBottom: 10, fontWeight: 600 }}>{success}</div>}
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" disabled={loading} style={{ flex: 1, background: '#7c3aed', color: 'white', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onCancel} style={{ flex: 1, background: '#eee', color: '#222', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: 15,
  margin: '6px 0 8px 0',
  fontWeight: 500,
};

export default EditProfileModal; 