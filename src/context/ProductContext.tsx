import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: number | string;
  name: string;
  weight?: string;
  oldPrice?: string;
  price: string;
  image: string;
  images?: string[];
  soldOut?: boolean;
  description?: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number | string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: number | string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Shuddh Swad Elaichi Thekua',
    oldPrice: 'Rs. 599.00',
    price: 'Rs. 299.00',
    image: '/images/product_thekua.png',
    soldOut: true,
  },
  {
    id: 2,
    name: 'Shuddh Swad Elaichi Thekua 3 Combo',
    oldPrice: 'Rs. 1,799.00',
    price: 'Rs. 799.00',
    image: '/images/product_thekua.png',
    soldOut: true,
  },
  {
    id: 3,
    name: 'Shuddh Swad Jaggery Thekua',
    oldPrice: 'Rs. 599.00',
    price: 'Rs. 299.00',
    image: '/images/product_thekua.png',
    soldOut: true,
  },
  {
    id: 4,
    name: 'Shuddh Swad Jaggery Thekua 3 Combo',
    oldPrice: 'Rs. 1,799.00',
    price: 'Rs. 799.00',
    image: '/images/product_thekua.png',
    soldOut: true,
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('masala-shop-products');
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts);
      } catch (e) {
        console.error('Failed to parse products from local storage', e);
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('masala-shop-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: Date.now().toString(), // Simple ID generation
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: number | string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id: number | string) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
