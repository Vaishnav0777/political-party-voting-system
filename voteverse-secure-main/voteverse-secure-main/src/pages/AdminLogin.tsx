
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui-custom/GlassCard';
import AnimatedTransition from '@/components/ui-custom/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await adminLogin(username, password);
      if (success) {
        navigate('/admin-dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Header showBackButton />
      
      <main className="page-container">
        <AnimatedTransition animation="fade">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">Administrator Access</h1>
            <p className="text-gray-600 text-sm">
              Secure login for election administrators
            </p>
          </div>
        </AnimatedTransition>
        
        <GlassCard className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              For demo: username: admin, password: admin123
            </p>
          </form>
        </GlassCard>
      </main>
    </div>
  );
};

export default AdminLogin;
