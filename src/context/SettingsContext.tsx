import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  heroTitle: string;
  setHeroTitle: (title: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (subtitle: string) => void;
  heroImages: string[];
  addHeroImage: (url: string) => void;
  removeHeroImage: (index: number) => void;
  aboutText: string;
  setAboutText: (text: string) => void;
  contactAddress: string;
  setContactAddress: (text: string) => void;
  contactPhone: string;
  setContactPhone: (text: string) => void;
  contactEmail: string;
  setContactEmail: (text: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroTitle, setHeroTitle] = useState<string>(() => {
    return localStorage.getItem('heroTitle') || 'Shuddh Swad, Parampara Ka!';
  });

  const [heroSubtitle, setHeroSubtitle] = useState<string>(() => {
    return localStorage.getItem('heroSubtitle') || 'Experience the true taste of tradition with our authentic, homemade Thekua & premium spices. Delivered fresh to your doorstep.';
  });

  const [heroImages, setHeroImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('heroImages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Could not parse heroImages", e);
      }
    }
    return ['/images/hero_bg.png']; // Default image
  });

  const [aboutText, setAboutText] = useState<string>(() => {
    return localStorage.getItem('aboutText') || `Welcome to Swadishth Raja, where tradition meets taste. Born from a passion for authentic regional delicacies, we are dedicated to bringing the pure, unadulterated flavors of India straight to your home.\n\nOur journey began with a simple idea: to make traditional, homemade recipes accessible to everyone. Our signature Thekuas and premium spice blends are crafted using age-old techniques, handpicked ingredients, and a whole lot of love.\n\nWe believe in "Shuddh Swad" (Pure Taste). That means no artificial preservatives, no harmful additives—just wholesome, natural goodness that reminds you of home.\n\nOur Promise: To never compromise on quality, authenticity, and the cultural heritage of our food. Thank you for being a part of our journey.`;
  });

  const [contactAddress, setContactAddress] = useState<string>(() => {
    return localStorage.getItem('contactAddress') || `Swadishth Raja Kitchens\n123 Heritage Lane\nPatna, Bihar, India 800001`;
  });

  const [contactPhone, setContactPhone] = useState<string>(() => {
    return localStorage.getItem('contactPhone') || `Customer Support:\n+91 98765 43210\nMon-Sat: 9:00 AM - 6:00 PM`;
  });

  const [contactEmail, setContactEmail] = useState<string>(() => {
    return localStorage.getItem('contactEmail') || `For Orders:\norders@swadishthraja.com\nFor Support:\ncontact@swadishthraja.com`;
  });

  useEffect(() => {
    localStorage.setItem('heroTitle', heroTitle);
  }, [heroTitle]);

  useEffect(() => {
    localStorage.setItem('heroSubtitle', heroSubtitle);
  }, [heroSubtitle]);

  useEffect(() => {
    localStorage.setItem('heroImages', JSON.stringify(heroImages));
  }, [heroImages]);

  useEffect(() => {
    localStorage.setItem('aboutText', aboutText);
  }, [aboutText]);

  useEffect(() => {
    localStorage.setItem('contactAddress', contactAddress);
  }, [contactAddress]);

  useEffect(() => {
    localStorage.setItem('contactPhone', contactPhone);
  }, [contactPhone]);

  useEffect(() => {
    localStorage.setItem('contactEmail', contactEmail);
  }, [contactEmail]);

  const addHeroImage = (url: string) => {
    setHeroImages(prev => [...prev, url]);
  };

  const removeHeroImage = (index: number) => {
    setHeroImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SettingsContext.Provider value={{ 
      heroTitle, setHeroTitle, 
      heroSubtitle, setHeroSubtitle,
      heroImages, addHeroImage, removeHeroImage,
      aboutText, setAboutText,
      contactAddress, setContactAddress,
      contactPhone, setContactPhone,
      contactEmail, setContactEmail
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
