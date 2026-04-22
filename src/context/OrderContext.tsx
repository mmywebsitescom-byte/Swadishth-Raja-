import React, { createContext, useContext, useState } from 'react';

export interface Order {
  id: string;
  date: string;
  customerName: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: string;
  address?: string;
}

interface OrderContextType {
  orders: Order[];
  totalRevenue: number;
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const initialOrders: Order[] = [
  { id: '#ORD-001', date: '2023-10-25', customerName: 'Rahul Verma', total: 450, status: 'Delivered', items: '2x Garam Masala, 1x Turmeric Powder' },
  { id: '#ORD-002', date: '2023-11-12', customerName: 'Priya Sharma', total: 850, status: 'Processing', items: '1x Premium Combo Pack' },
  { id: '#ORD-003', date: '2023-11-15', customerName: 'Amit Singh', total: 1200, status: 'Shipped', items: '3x Elaichi Thekua Combo' },
  { id: '#ORD-004', date: '2023-11-18', customerName: 'Neha Gupta', total: 299, status: 'Processing', items: '1x Jaggery Thekua' },
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('masala-shop-orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse orders from local storage', e);
      }
    }
    return initialOrders;
  });

  // Since we don't have React useEffect imported here yet, I should import it first or use a chunk that includes line 1.
  // Wait, I will use replace_file_content to import useEffect first.
  React.useEffect(() => {
    localStorage.setItem('masala-shop-orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`, // Simple unique ID generator
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== 'Cancelled') {
      return sum + order.total;
    }
    return sum;
  }, 0);

  return (
    <OrderContext.Provider value={{ orders, totalRevenue, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};
