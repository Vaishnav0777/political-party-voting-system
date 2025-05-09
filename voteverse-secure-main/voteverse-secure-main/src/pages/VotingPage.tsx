
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, User } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui-custom/GlassCard';
import AnimatedTransition from '@/components/ui-custom/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';
import { useVoting } from '@/context/VotingContext';

const VotingPage = () => {
  const { currentUser } = useAuth();
  const { getCandidatesByDistrict, selectCandidate, selectedCandidate, submitVote } = useVoting();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      toast.error("You need to log in first");
      navigate('/login');
      return;
    }
    
    if (!currentUser.district) {
      toast.error("Please select your district first");
      navigate('/select-district');
      return;
    }
  }, [currentUser, navigate]);

  const candidates = currentUser ? getCandidatesByDistrict(currentUser.district) : [];

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate first");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await submitVote();
      if (success) {
        toast.success("Your vote has been recorded");
        navigate('/vote-success');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Header showBackButton />
      
      <main className="page-container max-w-3xl">
        <AnimatedTransition animation="fade">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">Cast Your Vote</h1>
            <p className="text-gray-600 text-sm">
              {currentUser.district} District Election
            </p>
          </div>
        </AnimatedTransition>
        
        <GlassCard className="w-full mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
              <User size={32} className="text-primary/80" />
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-medium">{currentUser.name}</h2>
              <p className="text-gray-600 text-sm">
                Voter ID: {currentUser.id}
              </p>
              <p className="text-gray-600 text-sm">
                District: {currentUser.district}
              </p>
            </div>
          </div>
        </GlassCard>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Select a Candidate</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((candidate, index) => (
              <AnimatedTransition 
                key={candidate.id} 
                animation="scale" 
                className={`delay-${index * 100}`}
              >
                <GlassCard
                  className={`border-2 transition-all duration-300 ${
                    selectedCandidate === candidate.id
                      ? 'border-primary/50'
                      : 'border-transparent'
                  }`}
                  onClick={() => selectCandidate(candidate.id)}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={candidate.image} 
                      alt={candidate.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{candidate.name}</h4>
                      <p className="text-gray-600 text-sm">Candidate #{index + 1}</p>
                    </div>
                    
                    {selectedCandidate === candidate.id && (
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check size={14} className="text-primary" />
                      </div>
                    )}
                  </div>
                </GlassCard>
              </AnimatedTransition>
            ))}
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/select-district')}
            disabled={isSubmitting}
          >
            Back
          </Button>
          
          <Button 
            onClick={handleVote}
            disabled={!selectedCandidate || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Vote'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VotingPage;
