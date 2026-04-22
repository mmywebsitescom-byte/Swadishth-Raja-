import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useOrders } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, User, LogOut, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'address'>('profile');

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh', textAlign: 'center' }}>
        <h2>Please sign in to view your profile.</h2>
        <button className="btn" onClick={() => navigate('/auth')} style={{ marginTop: '1rem' }}>Go to Login</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const { orders } = useOrders();
  const userOrders = orders.filter(o => o.customerName === user.name);

  const mockAddresses = [
    { id: 1, type: 'Home', address: '123 Main Street, Appt 4B', city: 'Mumbai', state: 'Maharashtra', pin: '400001' },
    { id: 2, type: 'Office', address: 'Tech Park, Building C', city: 'Bangalore', state: 'Karnataka', pin: '560001' },
  ];

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <h2 className="section-title">My Account</h2>
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div style={{ flex: '1', minWidth: '250px', backgroundColor: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', alignSelf: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#fed7d7', color: '#c53030', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 style={{ margin: 0 }}>{user.name}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{user.email}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: 'none', background: activeTab === 'profile' ? '#f8fafc' : 'transparent', color: activeTab === 'profile' ? 'var(--primary-color)' : '#475569', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'profile' ? '600' : '400', transition: 'all 0.2s' }}>
              <User size={18} /> Account Details
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: 'none', background: activeTab === 'orders' ? '#f8fafc' : 'transparent', color: activeTab === 'orders' ? 'var(--primary-color)' : '#475569', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'orders' ? '600' : '400', transition: 'all 0.2s' }}>
              <Package size={18} /> My Orders
            </button>
            <button 
              onClick={() => setActiveTab('address')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: 'none', background: activeTab === 'address' ? '#f8fafc' : 'transparent', color: activeTab === 'address' ? 'var(--primary-color)' : '#475569', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'address' ? '600' : '400', transition: 'all 0.2s' }}>
              <MapPin size={18} /> Saved Addresses
            </button>
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: 'none', background: 'transparent', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', marginTop: '1rem', transition: 'all 0.2s' }}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: '3', minWidth: '300px', backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={24} color="var(--primary-color)" /> Account Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Full Name</label>
                  <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>{user.name}</div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Email Address</label>
                  <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>{user.email}</div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Phone Number</label>
                  <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>+91 98765 43210</div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Member Since</label>
                  <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>{new Date().toLocaleDateString()}</div>
                </div>
              </div>
              <button className="btn outline" style={{ marginTop: '2rem' }}>Edit Details</button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={24} color="var(--primary-color)" /> My Orders</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userOrders.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No orders found.</p>
                ) : (
                  userOrders.map(order => (
                    <div key={order.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                        <div>
                          <span style={{ fontWeight: '600' }}>{order.id}</span>
                          <span style={{ color: '#64748b', marginLeft: '1rem', fontSize: '0.9rem' }}>{order.date}</span>
                        </div>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '500', backgroundColor: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Processing' ? '#fef08a' : order.status === 'Cancelled' ? '#fee2e2' : '#e0e7ff', color: order.status === 'Delivered' ? '#166534' : order.status === 'Processing' ? '#854d0e' : order.status === 'Cancelled' ? '#b91c1c' : '#3730a3' }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: '0 0 0.5rem 0', color: '#475569', fontSize: '0.9rem' }}>{order.items}</p>
                          <p style={{ margin: 0, fontWeight: '600' }}>Total: ₹{order.total}</p>
                        </div>
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          View Details <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={24} color="var(--primary-color)" /> Saved Addresses</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {mockAddresses.map(addr => (
                  <div key={addr.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>
                      {addr.type}
                    </span>
                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{user.name}</h5>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#475569', fontSize: '0.9rem' }}>{addr.address}</p>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#475569', fontSize: '0.9rem' }}>{addr.city}, {addr.state}</p>
                    <p style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '0.9rem' }}>{addr.pin}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '500', cursor: 'pointer', fontSize: '0.85rem' }}>Edit</button>
                      <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '500', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                    </div>
                  </div>
                ))}
                
                <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '150px', backgroundColor: '#f8fafc', color: 'var(--primary-color)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <MapPin size={20} />
                  </div>
                  <span style={{ fontWeight: '500' }}>Add New Address</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
