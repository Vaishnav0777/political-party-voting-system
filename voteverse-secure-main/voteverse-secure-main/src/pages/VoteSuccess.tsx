
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui-custom/GlassCard';
import AnimatedTransition from '@/components/ui-custom/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';

const VoteSuccess = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Header />
      
      <main className="page-container">
        <AnimatedTransition animation="scale">
          <GlassCard className="w-full max-w-md text-center">
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              
              <div>
                <h1 className="text-2xl font-semibold mb-2">Vote Recorded Successfully</h1>
                <p className="text-gray-600 text-sm mb-6">
                  Thank you for participating in the election. Your vote has been securely recorded.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Important:</span> You can only vote once. The results will be published after the election period ends.
                  </p>
                </div>
                
                <Button
                  onClick={logout}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </GlassCard>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default VoteSuccess;
