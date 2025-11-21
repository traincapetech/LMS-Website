import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiShoppingCart, FiBell, FiMessageSquare, FiSettings, FiCreditCard, FiLogOut, FiGlobe, FiEdit2, FiCamera } from "react-icons/fi";
import EditProfileModal from "./EditProfileModal";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

const UserProfileDropdown = ({ user, cartCount = 0, onLogout, onProfilePhotoUpload }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhoto, setEditPhoto] = useState(user.photoUrl || "");
  const [showEditModal, setShowEditModal] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditPhoto(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setEditPhoto("");
  };

  const handleSave = () => {
    onProfilePhotoUpload(editPhoto);
    // Save name to localStorage
    const updatedUser = { ...user, name: editName, photoUrl: editPhoto };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
    window.location.reload(); // To update everywhere
  };

  const handleCancel = () => {
    setEditName(user.name);
    setEditPhoto(user.photoUrl || "");
    setIsEditing(false);
  };

  const handleEditSave = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowEditModal(false);
    window.location.reload();
  };

  return (
    <>
      {showEditModal && (
        <EditProfileModal
          user={user}
          onSave={handleEditSave}
          onCancel={() => setShowEditModal(false)}
        />
      )}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '120%',
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          minWidth: 270,
          zIndex: 1000,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 20, borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#222',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 700,
            overflow: 'hidden',
            position: 'relative',
          }}>
            {user.photoUrl ? (
              <img src={user.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <div style={{ fontWeight: 700, fontSize: 17, marginTop: 8 }}>{user.name}</div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{user.email}</div>
          <div style={{ fontWeight: 600, color: user.role === 'admin' ? '#ef4444' : user.role === 'instructor' ? '#10b981' : '#6366f1', fontSize: 14, marginBottom: 4 }}>
            {user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Student'}
          </div>
          <button
            style={{
              background: 'none',
              border: '1px solid #7c3aed',
              color: '#7c3aed',
              borderRadius: 6,
              padding: '6px 18px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              marginTop: 8,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onClick={() => setShowEditModal(true)}
          >
            <FiEdit2 /> Edit
          </button>
        </div>
        <div style={{ padding: 0 }}>
          <MenuItem icon={<FiUser />} label="My Learning" onClick={() => navigate('/my-learning')} />
          <MenuItem icon={<FiShoppingCart />} label="My Cart" badge={cartCount} onClick={() => navigate('/cart')} />
          <MenuItem icon={<FiUser />} label="Wishlist" onClick={() => navigate('/wishlist')} />
          <MenuItem icon={<FiUser />} label="Teach" onClick={() => navigate('/teach')} />
          <Divider />
          <MenuItem icon={<FiBell />} label="Notifications" onClick={() => navigate('/notifications')} />
          <MenuItem icon={<FiMessageSquare />} label="Messages" onClick={() => navigate('/messages')} />
          <Divider />
          <MenuItem icon={<FiSettings />} label="Account Settings" onClick={() => navigate('/settings')} />
          <MenuItem icon={<FiCreditCard />} label="Payment Methods" onClick={() => navigate('/payment-methods')} />
          <MenuItem icon={<FiUser />} label="Subscriptions" onClick={() => navigate('/subscriptions')} />
          <MenuItem icon={<FiUser />} label="Credits" onClick={() => navigate('/credits')} />
          <MenuItem icon={<FiUser />} label="Purchase History" onClick={() => navigate('/purchase-history')} />
          <Divider />
          <MenuItem icon={<FiGlobe />} label="Language" rightLabel="English" />
          <MenuItem icon={<FiUser />} label="Public Profile" onClick={() => navigate('/profile')} />
          <Divider />
          <MenuItem icon={<FiLogOut />} label="Logout" onClick={onLogout} danger />
        </div>
      </div>
    </>
  );
};

const MenuItem = ({ icon, label, badge, rightLabel, onClick, danger }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      cursor: 'pointer',
      color: danger ? '#d32f2f' : '#222',
      fontWeight: 500,
      fontSize: 15,
      background: danger ? '#fff5f5' : 'transparent',
      borderBottom: '1px solid #f7f7f7',
      justifyContent: 'space-between',
    }}
    onMouseOver={e => (e.currentTarget.style.background = '#f7f7f7')}
    onMouseOut={e => (e.currentTarget.style.background = danger ? '#fff5f5' : 'transparent')}
  >
    <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {icon}
      {label}
      {badge ? (
        <span style={{
          background: '#a259ff',
          color: 'white',
          borderRadius: '50%',
          fontSize: 12,
          fontWeight: 700,
          padding: '2px 8px',
          marginLeft: 8,
        }}>{badge}</span>
      ) : null}
    </span>
    {rightLabel && <span style={{ fontSize: 13, color: '#888' }}>{rightLabel}</span>}
  </div>
);

const Divider = () => <div style={{ height: 1, background: '#eee', margin: 0 }} />;

export default UserProfileDropdown; 