
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

// Mock data - in a real app, this would come from an API
const MOCK_VOTERS = [
  { id: '1001', phone: '9876543210', name: 'John Doe', district: 'North', hasVoted: false },
  { id: '1002', phone: '9876543211', name: 'Jane Smith', district: 'South', hasVoted: false },
  { id: '1003', phone: '9876543212', name: 'Alice Johnson', district: 'East', hasVoted: true },
  { id: '1004', phone: '9876543213', name: 'Bob Williams', district: 'West', hasVoted: false },
];

// Mock admin credentials
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

interface Voter {
  id: string;
  phone: string;
  name: string;
  district: string;
  hasVoted: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: Voter | null;
  loginWithPhone: (phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setDistrict: (district: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<Voter | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for stored session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    if (storedIsAdmin === 'true') {
      setIsAdmin(true);
      setIsAuthenticated(true);
    }
  }, []);

  const loginWithPhone = async (phone: string): Promise<boolean> => {
    // In a real app, this would send an OTP to the user's phone
    const voter = MOCK_VOTERS.find(v => v.phone === phone);
    
    if (!voter) {
      toast.error("Phone number not registered in our system");
      return false;
    }
    
    setPendingPhone(phone);
    toast.success("OTP sent to your phone", {
      description: "Use '1234' as OTP for demo purposes"
    });
    return true;
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    // In a real app, this would verify the OTP with a backend service
    if (otp !== '1234' || !pendingPhone) {
      toast.error("Invalid OTP");
      return false;
    }
    
    const voter = MOCK_VOTERS.find(v => v.phone === pendingPhone);
    
    if (!voter) {
      toast.error("User not found");
      return false;
    }
    
    setCurrentUser(voter);
    setIsAuthenticated(true);
    setPendingPhone(null);
    localStorage.setItem('currentUser', JSON.stringify(voter));
    
    return true;
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      setIsAuthenticated(true);
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    
    toast.error("Invalid admin credentials");
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };
  
  const setDistrict = (district: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, district };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        currentUser,
        loginWithPhone,
        verifyOtp,
        adminLogin,
        logout,
        setDistrict
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
