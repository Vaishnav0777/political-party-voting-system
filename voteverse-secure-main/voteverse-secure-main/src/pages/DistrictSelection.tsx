
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui-custom/GlassCard';
import AnimatedTransition from '@/components/ui-custom/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';
import { useVoting } from '@/context/VotingContext';
import { toast } from '@/components/ui/sonner';

const DistrictSelection = () => {
  const { setDistrict, currentUser } = useAuth();
  const { districts } = useVoting();
  const navigate = useNavigate();

  const handleSelectDistrict = (district: string) => {
    if (!currentUser) {
      toast.error("You need to log in first");
      navigate('/login');
      return;
    }
    
    setDistrict(district);
    toast.success(`District selected: ${district}`);
    navigate('/voting');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Header showBackButton />
      
      <main className="page-container">
        <AnimatedTransition animation="fade">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Select Your District</h1>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Choose the district where you are registered to vote. You can only vote in your registered district.
            </p>
          </div>
        </AnimatedTransition>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {districts.map((district, index) => (
            <AnimatedTransition 
              key={district} 
              animation="scale" 
              className={`delay-${index * 100}`}
            >
              <GlassCard
                className="text-center"
                onClick={() => handleSelectDistrict(district)}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                    <MapPin size={24} className="text-primary/80" />
                  </div>
                  <h3 className="text-lg font-medium">{district} District</h3>
                </div>
              </GlassCard>
            </AnimatedTransition>
          ))}
        </div>
        
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="text-sm"
          >
            Go Back
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DistrictSelection;
