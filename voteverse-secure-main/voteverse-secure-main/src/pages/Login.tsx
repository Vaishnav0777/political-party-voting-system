
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui-custom/GlassCard';
import AnimatedTransition from '@/components/ui-custom/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithPhone, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await loginWithPhone(phoneNumber);
      if (success) {
        setStep('otp');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await verifyOtp(otp);
      if (success) {
        navigate('/select-district');
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
            <h1 className="text-2xl font-semibold mb-2">
              {step === 'phone' ? 'Voter Verification' : 'Enter OTP'}
            </h1>
            <p className="text-gray-600 text-sm">
              {step === 'phone' 
                ? 'Please enter your registered phone number' 
                : 'Enter the one-time password sent to your phone'}
            </p>
          </div>
        </AnimatedTransition>
        
        <GlassCard className="w-full max-w-md">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Request OTP'}
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                For demo purposes, enter: 9876543210
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    maxLength={4}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => setStep('phone')}
                >
                  Change phone number
                </button>
                
                <p className="text-xs text-gray-500">
                  For demo: 1234
                </p>
              </div>
            </form>
          )}
        </GlassCard>
      </main>
    </div>
  );
};

export default Login;
