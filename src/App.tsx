import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ReturnPolicy from './pages/ReturnPolicy';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ProductDetails from './pages/ProductDetails';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <UserProvider>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
              <Footer />
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </UserProvider>
    </SettingsProvider>
  );
};

export default App;
