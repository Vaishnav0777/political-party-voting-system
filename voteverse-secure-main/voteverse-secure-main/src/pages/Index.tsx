
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import AnimatedTransition from '@/components/ui-custom/AnimatedTransition';
import Header from '@/components/layout/Header';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Header electionDate="June 15, 2024" />
      
      <main className="page-container">
        <div className="flex flex-col items-center mb-12">
          <AnimatedTransition animation="fade" className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight mb-4">
              <span className="font-light">Party</span> Voting System
            </h1>
            <p className="text-gray-600 max-w-lg mb-8 text-balance">
              A secure internal voting platform for political party elections
            </p>
          </AnimatedTransition>
        </div>
        
        <div className="w-full max-w-md grid grid-cols-1 gap-8">
          <AnimatedTransition animation="scale" className="delay-100">
            <GlassCard
              className="text-center"
              onClick={() => navigate('/login')}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                  <User size={32} className="text-primary/80" />
                </div>
                <div>
                  <h2 className="text-xl font-medium mb-2">Voter Access</h2>
                  <p className="text-gray-600 text-sm">
                    Securely cast your vote in the constituency election
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedTransition>
          
          <AnimatedTransition animation="scale" className="delay-200">
            <GlassCard
              className="text-center"
              onClick={() => navigate('/admin-login')}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                  <Shield size={32} className="text-primary/80" />
                </div>
                <div>
                  <h2 className="text-xl font-medium mb-2">Administrator</h2>
                  <p className="text-gray-600 text-sm">
                    Manage elections, view statistics, and publish results
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedTransition>
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Party Voting System. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
