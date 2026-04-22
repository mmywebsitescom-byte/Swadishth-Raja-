import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProducts, type Product } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { 
  LayoutDashboard, Folder, Database, Heart, FileText, Trash2, Search, Plus, MoreHorizontal, ChevronDown, Edit2, Menu
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { 
    heroTitle, setHeroTitle, heroSubtitle, setHeroSubtitle, heroImages, addHeroImage, removeHeroImage,
    aboutText, setAboutText, contactAddress, setContactAddress,
    contactPhone, setContactPhone, contactEmail, setContactEmail
  } = useSettings();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'page-home' | 'page-about' | 'page-contact'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [localTitle, setLocalTitle] = useState(heroTitle);
  const [localSubtitle, setLocalSubtitle] = useState(heroSubtitle);
  const [localAboutText, setLocalAboutText] = useState(aboutText);
  const [localContactAddress, setLocalContactAddress] = useState(contactAddress);
  const [localContactPhone, setLocalContactPhone] = useState(contactPhone);
  const [localContactEmail, setLocalContactEmail] = useState(contactEmail);
  const [newHeroImage, setNewHeroImage] = useState('');
  const [saved, setSaved] = useState(false);

  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductOldPrice, setNewProductOldPrice] = useState('');
  const [newProductWeight, setNewProductWeight] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);

  useEffect(() => {
    setLocalTitle(heroTitle);
  }, [heroTitle]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroTitle(localTitle);
    setHeroSubtitle(localSubtitle);
    setAboutText(localAboutText);
    setContactAddress(localContactAddress);
    setContactPhone(localContactPhone);
    setContactEmail(localContactEmail);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddHeroImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHeroImage) {
      addHeroImage(newHeroImage);
      setNewHeroImage('');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const imageArray = newProductImage.split(',').map(s => s.trim()).filter(Boolean);
    const mainImage = imageArray.length > 0 ? imageArray[0] : '/images/hero_bg.png';

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: newProductName,
        price: newProductPrice.startsWith('Rs.') || newProductPrice.startsWith('₹') ? newProductPrice : `₹${newProductPrice}`,
        oldPrice: newProductOldPrice ? (newProductOldPrice.startsWith('Rs.') || newProductOldPrice.startsWith('₹') ? newProductOldPrice : `₹${newProductOldPrice}`) : undefined,
        image: mainImage,
        images: imageArray,
        weight: newProductWeight || undefined,
        description: newProductDescription || undefined
      });
      setEditingProductId(null);
    } else {
      const newProductData = {
        name: newProductName,
        price: `₹${newProductPrice}`,
        oldPrice: newProductOldPrice ? `₹${newProductOldPrice}` : undefined,
        image: mainImage,
        images: imageArray,
        soldOut: false,
        weight: newProductWeight || undefined,
        description: newProductDescription || undefined
      };
      addProduct(newProductData);
    }

    resetProductForm();
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setNewProductName(product.name);
    // Extract numbers from price strings like "Rs. 299.00" or "₹299"
    setNewProductPrice(product.price.replace(/[^\d.]/g, ''));
    setNewProductOldPrice(product.oldPrice ? product.oldPrice.replace(/[^\d.]/g, '') : '');
    setNewProductWeight(product.weight || '');
    setNewProductImage(product.images ? product.images.join(', ') : product.image);
    setNewProductDescription(product.description || '');
    
    // Scroll to top of form
    const formElement = document.getElementById('product-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductOldPrice('');
    setNewProductWeight('');
    setNewProductImage('');
    setNewProductDescription('');
  };

  // Compute data for Line Chart (Revenue over time)
  const revenueByDate: Record<string, number> = {};
  orders.forEach(order => {
    if (order.status !== 'Cancelled') {
      revenueByDate[order.date] = (revenueByDate[order.date] || 0) + order.total;
    }
  });

  const sortedDates = Object.keys(revenueByDate).sort();
  const lineData = sortedDates.map(date => ({
    name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Revenue: revenueByDate[date]
  }));

  // If no data, provide a default empty state
  if (lineData.length === 0) {
    lineData.push({ name: 'No Data', Revenue: 0 });
  }

  // Compute data for Pie Chart (Order Statuses)
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const totalValidOrders = processingCount + shippedCount + deliveredCount || 1; // avoid division by zero

  const pieData = [
    { 
      name: 'Processing', 
      value: Math.round((processingCount / totalValidOrders) * 100), 
      color: 'var(--accent-color)',
      desc: 'Orders currently being prepared.'
    },
    { 
      name: 'Shipped', 
      value: Math.round((shippedCount / totalValidOrders) * 100), 
      color: 'var(--primary-color)',
      desc: 'Orders out for delivery.'
    },
    { 
      name: 'Delivered', 
      value: Math.round((deliveredCount / totalValidOrders) * 100), 
      color: 'var(--text-dark)',
      desc: 'Successfully completed orders.'
    },
  ];

  const SidebarItem = ({ icon: Icon, label, id, isSub = false }: any) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => id && setActiveTab(id)}
        style={{
          display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', padding: '0.875rem 1.5rem',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent', border: 'none', cursor: id ? 'pointer' : 'default',
          color: isActive ? 'var(--accent-color)' : 'rgba(255,255,255,0.7)',
          borderLeft: isActive ? '4px solid var(--accent-color)' : '4px solid transparent',
          fontWeight: isActive ? 600 : 400,
          fontSize: '1rem',
          transition: 'all 0.2s',
          marginTop: isSub ? '1rem' : '0'
        }}
      >
        <Icon size={20} color={isActive ? 'var(--accent-color)' : 'rgba(255,255,255,0.7)'} />
        {label}
      </button>
    );
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'var(--bg-color)', display: 'flex', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* SIDEBAR */}
      <div style={{ 
        width: isSidebarOpen ? '260px' : '0px', 
        backgroundColor: 'var(--primary-color)', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
          <img src="/src/assets/logo.png" alt="Logo" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Swadishth Raja</span>
        </div>
        
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
            <input type="text" placeholder="Search" style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
            <Search size={18} color="rgba(255,255,255,0.7)" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
          <SidebarItem icon={Folder} label="My Project (Products)" id="products" />
          <SidebarItem icon={Database} label="Data (Orders)" id="orders" />
          
          <div style={{ padding: '1rem 1.5rem 0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pages</div>
          <SidebarItem icon={FileText} label="Home Page" id="page-home" />
          <SidebarItem icon={FileText} label="About Page" id="page-about" />
          <SidebarItem icon={FileText} label="Contact Page" id="page-contact" />
          
          <div style={{ margin: '1.5rem 1.5rem', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
          
          <button 
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', padding: '0.875rem 1.5rem',
              backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              borderLeft: '4px solid transparent',
              fontWeight: 400,
              fontSize: '1rem',
              transition: 'all 0.2s',
            }}
          >
            <Search size={20} color="rgba(255,255,255,0.7)" />
            View Live Store
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 3rem', borderBottom: '1px solid #e5e7eb', backgroundColor: 'var(--bg-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Menu size={28} />
            </button>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
              {activeTab === 'dashboard' ? 'Dashboard Management' : activeTab === 'products' ? 'Product Management' : activeTab === 'orders' ? 'Order Management' : 'System Settings'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent-color)', color: 'var(--text-dark)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <Plus size={18} /> Assign Member
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)' }}>Claudia Alves</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Administrator</p>
              </div>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', border: '2px solid var(--accent-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <img src="https://i.pravatar.cc/100?img=5" alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={{ padding: '2rem 3rem', flex: 1 }}>
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Line Chart Card */}
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)' }}>Report and Analysis</h3>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Sort by <span style={{ fontWeight: 600, color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>this week <ChevronDown size={14} /></span>
                    </div>
                  </div>
                  
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-sm)' }} />
                        <Line type="monotone" dataKey="Revenue" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary-color)' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-start' }}>
                    <button style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'transparent', border: '1px solid white' }}></span> Revenue
                    </button>
                    <button style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', backgroundColor: 'var(--bg-color)', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', fontWeight: 500, cursor: 'pointer', marginLeft: 'auto' }}>
                      Details
                    </button>
                  </div>
                </div>

                {/* Feedback Card */}
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem 2rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                      <img src="https://i.pravatar.cc/100?img=11" alt="Alfredo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--text-dark)' }}>Alfredo Torres</h4>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', maxWidth: '400px' }}>"I am extremely satisfied! Your professional team provided precise for my business needs."</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--primary-color)' }}>
                      <Search size={16} /> <Heart size={16} /> <Trash2 size={16} />
                    </div>
                    <button style={{ padding: '0.5rem 2rem', borderRadius: '8px', backgroundColor: 'var(--accent-color)', color: 'var(--text-dark)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Pie Chart Sidebar */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)' }}>Progress</h3>
                  <MoreHorizontal size={20} color="var(--primary-color)" cursor="pointer" />
                </div>
                
                <div style={{ width: '100%', height: '250px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={100}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {pieData.map((item, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }}></span>
                          <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{item.name}</span>
                        </div>
                        <span style={{ color: item.color, fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {item.value}%
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', paddingLeft: '1.25rem' }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
               <h3 id="product-form" style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-color)' }}>
                 {editingProductId ? 'Edit Product' : 'Add New Product'}
               </h3>
               <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>Product Name *</label>
                    <input type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>Weight / Amount (e.g., 500gm, 1kg)</label>
                    <input type="text" value={newProductWeight} onChange={(e) => setNewProductWeight(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>Price (₹) *</label>
                    <input type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>Discount / Old Price (₹) (Optional)</label>
                    <input type="number" value={newProductOldPrice} onChange={(e) => setNewProductOldPrice(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>Image URLs (comma separated for multiple)</label>
                    <input type="text" value={newProductImage} onChange={(e) => setNewProductImage(e.target.value)} placeholder="url1.png, url2.png..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>Product Details / Description (Optional)</label>
                    <textarea value={newProductDescription} onChange={(e) => setNewProductDescription(e.target.value)} placeholder="Authentic, homemade preparation..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '80px', resize: 'vertical' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-dark)', padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {editingProductId ? <><Edit2 size={18} /> Update Product</> : <><Plus size={18} /> Add Product</>}
                    </button>
                    {editingProductId && (
                      <button type="button" onClick={resetProductForm} style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>Product List</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--primary-color)' }}>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Name</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Price</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Stock Status</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>
                          {product.name}
                          {product.weight && <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>{product.weight}</span>}
                        </td>
                        <td style={{ padding: '1rem' }}>{product.price} {product.oldPrice && <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{product.oldPrice}</span>}</td>
                        <td style={{ padding: '1rem' }}>
                          <select 
                            value={product.soldOut ? "true" : "false"} 
                            onChange={(e) => updateProduct(product.id, { soldOut: e.target.value === 'true' })}
                            style={{ 
                              padding: '0.4rem', 
                              borderRadius: '6px', 
                              border: '1px solid #cbd5e1', 
                              backgroundColor: product.soldOut ? '#fee2e2' : '#dcfce7',
                              color: product.soldOut ? '#b91c1c' : '#166534',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <option value="false">In Stock</option>
                            <option value="true">Sold Out</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEditClick(product)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }} title="Edit Product"><Edit2 size={18} /></button>
                            <button onClick={() => deleteProduct(product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete Product"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-color)', color: 'var(--primary-color)' }}>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Order ID</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Date</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Customer</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Items</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Status</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-color)' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{order.id}</td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#64748b' }}>{order.date}</td>
                        <td style={{ padding: '1rem' }}>{order.customerName}</td>
                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{order.items}</td>
                        <td style={{ padding: '1rem' }}>
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            style={{ 
                              padding: '0.4rem', 
                              borderRadius: '6px', 
                              border: '1px solid #cbd5e1',
                              backgroundColor: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Processing' ? '#fef08a' : order.status === 'Cancelled' ? '#fee2e2' : '#e0e7ff', 
                              color: order.status === 'Delivered' ? '#166534' : order.status === 'Processing' ? '#854d0e' : order.status === 'Cancelled' ? '#b91c1c' : '#3730a3',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>₹{order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          )}

          {/* PAGE: HOME */}
          {activeTab === 'page-home' && (
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-color)' }}>Home Page Content</h3>
                <form onSubmit={handleSaveSettings}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)' }}>Main Hero Title</label>
                    <input 
                      type="text" 
                      value={localTitle}
                      onChange={(e) => setLocalTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '600px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)' }}>Main Hero Subtitle</label>
                    <textarea 
                      value={localSubtitle}
                      onChange={(e) => setLocalSubtitle(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '600px', minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.8rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                  {saved && <span style={{ marginLeft: '1rem', color: '#16a34a', fontWeight: 500 }}>Saved!</span>}
                </form>
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-color)' }}>Hero Image Slider</h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem' }}>Add images here to create a scrolling carousel on the homepage.</p>
                
                <form onSubmit={handleAddHeroImage} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', maxWidth: '600px' }}>
                  <input 
                    type="text" 
                    value={newHeroImage}
                    onChange={(e) => setNewHeroImage(e.target.value)}
                    placeholder="Enter image URL..."
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    required
                  />
                  <button type="submit" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-dark)', padding: '0 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Add Image</button>
                </form>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {heroImages && heroImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', height: '120px' }}>
                      <img src={img} alt={`Hero ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => removeHeroImage(idx)}
                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAGE: ABOUT */}
          {activeTab === 'page-about' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-color)' }}>About Page Content</h3>
              <form onSubmit={handleSaveSettings}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)' }}>Our Story</label>
                  <textarea 
                    value={localAboutText}
                    onChange={(e) => setLocalAboutText(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '800px', minHeight: '300px', resize: 'vertical' }}
                  />
                </div>
                <button type="submit" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.8rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                {saved && <span style={{ marginLeft: '1rem', color: '#16a34a', fontWeight: 500 }}>Saved!</span>}
              </form>
            </div>
          )}

          {/* PAGE: CONTACT */}
          {activeTab === 'page-contact' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-color)' }}>Contact Page Content</h3>
              <form onSubmit={handleSaveSettings}>
                <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '800px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)' }}>Address Block</label>
                    <textarea 
                      value={localContactAddress}
                      onChange={(e) => setLocalContactAddress(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '120px', resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)' }}>Phone / Hours Block</label>
                    <textarea 
                      value={localContactPhone}
                      onChange={(e) => setLocalContactPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '120px', resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-dark)' }}>Email Support Block</label>
                    <textarea 
                      value={localContactEmail}
                      onChange={(e) => setLocalContactEmail(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '120px', resize: 'vertical' }}
                    />
                  </div>
                </div>
                <button type="submit" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.8rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                {saved && <span style={{ marginLeft: '1rem', color: '#16a34a', fontWeight: 500 }}>Saved!</span>}
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;
