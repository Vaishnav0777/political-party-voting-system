
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface HeaderProps {
  showBackButton?: boolean;
  electionDate?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  showBackButton = false,
  electionDate = "June 15, 2024" 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.includes('admin');

  const handleBack = () => {
    navigate(-1);
  };

  const showElectionInfo = () => {
    toast.info(`Election date: ${electionDate}`, {
      description: "Please ensure you cast your vote before the deadline.",
      duration: 5000,
    });
  };

  return (
    <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
      <div className="flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </Button>
        )}
        <h1 className="font-semibold text-lg">
          {isAdminPage ? "Election Administration" : "Voting System"}
        </h1>
      </div>
      
      {!isAdminPage && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-sm text-primary/80"
          onClick={showElectionInfo}
        >
          <Calendar size={16} />
          <span>Election: {electionDate}</span>
        </Button>
      )}
    </header>
  );
};

export default Header;
