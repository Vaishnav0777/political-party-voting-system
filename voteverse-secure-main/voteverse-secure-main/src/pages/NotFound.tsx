
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Header />
      
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          The page you're looking for doesn't exist
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Return to Home</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
