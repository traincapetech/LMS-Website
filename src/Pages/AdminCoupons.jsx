import React, { useState, useEffect } from 'react';
import { couponsAPI } from '../utils/api';
import ApiDebugger from '../components/ApiDebugger';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercentage: 40,
    description: '',
    validUntil: '',
    maxUses: '',
    minimumPurchase: 0
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await couponsAPI.getCoupons();
      setCoupons(response.data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      setError('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await couponsAPI.createCoupon(newCoupon);
      setCoupons([response.data, ...coupons]);
      setShowCreateForm(false);
      setNewCoupon({
        code: '',
        discountPercentage: 40,
        description: '',
        validUntil: '',
        maxUses: '',
        minimumPurchase: 0
      });
      alert('Coupon created successfully!');
    } catch (error) {
      console.error('Failed to create coupon:', error);
      alert(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const generateDefaultCoupons = async () => {
    try {
      const response = await couponsAPI.generateDefault();
      await fetchCoupons();
      alert(`Generated ${response.data.totalCreated} default coupons!`);
    } catch (error) {
      console.error('Failed to generate default coupons:', error);
      alert('Failed to generate default coupons');
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await couponsAPI.deleteCoupon(id);
      setCoupons(coupons.filter(coupon => coupon._id !== id));
      alert('Coupon deleted successfully!');
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: 60, fontSize: '18px', color: '#666' }}>
      Loading coupons...
    </div>
  );

  if (error) return (
    <div style={{ color: '#e11d48', textAlign: 'center', marginTop: 60, fontSize: '16px' }}>
      {error}
    </div>
  );

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '40px 24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Debug Component */}
      <ApiDebugger />
      
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '48px'
      }}>
        <h1 style={{ 
          fontWeight: 800, 
          fontSize: '42px', 
          marginBottom: '16px',
          color: '#1e293b',
          letterSpacing: '-0.025em'
        }}>
          Coupon Management
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Create and manage discount coupons for your courses
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '32px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create New Coupon
        </button>
        <button
          onClick={generateDefaultCoupons}
          style={{
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Generate Default Coupons
        </button>
      </div>

      {/* Create Coupon Form */}
      {showCreateForm && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', fontWeight: '600', color: '#1e293b' }}>
            Create New Coupon
          </h3>
          <form onSubmit={createCoupon}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Coupon Code</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Discount Percentage</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newCoupon.discountPercentage}
                  onChange={(e) => setNewCoupon({...newCoupon, discountPercentage: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                <input
                  type="text"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Valid Until (Optional)</label>
                <input
                  type="datetime-local"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon({...newCoupon, validUntil: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Max Uses (Optional)</label>
                <input
                  type="number"
                  min="1"
                  value={newCoupon.maxUses}
                  onChange={(e) => setNewCoupon({...newCoupon, maxUses: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Minimum Purchase</label>
                <input
                  type="number"
                  min="0"
                  value={newCoupon.minimumPurchase}
                  onChange={(e) => setNewCoupon({...newCoupon, minimumPurchase: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  background: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create Coupon
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '24px'
      }}>
        {coupons.map(coupon => (
          <div key={coupon._id} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ 
                  fontWeight: '700', 
                  fontSize: '20px', 
                  color: '#1e293b',
                  marginBottom: '4px'
                }}>
                  {coupon.code}
                </div>
                <div style={{ 
                  color: '#7c3aed', 
                  fontWeight: '600', 
                  fontSize: '16px'
                }}>
                  {coupon.discountPercentage}% OFF
                </div>
              </div>
              <div style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                background: coupon.isActive ? '#d1fae5' : '#fee2e2',
                color: coupon.isActive ? '#059669' : '#dc2626'
              }}>
                {coupon.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                {coupon.description || 'No description'}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Created: {new Date(coupon.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px',
              marginBottom: '16px',
              fontSize: '12px',
              color: '#64748b'
            }}>
              <div>
                <strong>Used:</strong> {coupon.usedCount || 0}
                {coupon.maxUses && ` / ${coupon.maxUses}`}
              </div>
              <div>
                <strong>Min Purchase:</strong> ₹{coupon.minimumPurchase || 0}
              </div>
              {coupon.validUntil && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Valid Until:</strong> {new Date(coupon.validUntil).toLocaleDateString()}
                </div>
              )}
            </div>

            <button
              onClick={() => deleteCoupon(coupon._id)}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%'
              }}
            >
              Delete Coupon
            </button>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#64748b',
          fontSize: '18px',
          padding: '60px 20px'
        }}>
          No coupons found. Create your first coupon or generate default coupons.
        </div>
      )}
    </div>
  );
};

export default AdminCoupons; 