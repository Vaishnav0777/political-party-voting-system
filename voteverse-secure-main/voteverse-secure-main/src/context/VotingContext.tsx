
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/sonner';

// Mock data for candidates and results
const MOCK_CANDIDATES = {
  'North': [
    { id: '101', name: 'Alexander Mitchell', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '102', name: 'Isabella Roberts', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '103', name: 'William Harrison', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '104', name: 'Olivia Thompson', votes: 0, image: 'https://via.placeholder.com/150' },
  ],
  'South': [
    { id: '201', name: 'Sophia Martinez', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '202', name: 'Benjamin Carter', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '203', name: 'Charlotte Wilson', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '204', name: 'Daniel Anderson', votes: 0, image: 'https://via.placeholder.com/150' },
  ],
  'East': [
    { id: '301', name: 'Emily Johnson', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '302', name: 'James Williams', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '303', name: 'Amelia Brown', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '304', name: 'Michael Jones', votes: 0, image: 'https://via.placeholder.com/150' },
  ],
  'West': [
    { id: '401', name: 'Ava Davis', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '402', name: 'Ethan Miller', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '403', name: 'Mia Wilson', votes: 0, image: 'https://via.placeholder.com/150' },
    { id: '404', name: 'Jacob Taylor', votes: 0, image: 'https://via.placeholder.com/150' },
  ],
};

const MOCK_VOTERS = [
  { id: '1001', phone: '9876543210', name: 'John Doe', district: 'North', hasVoted: false },
  { id: '1002', phone: '9876543211', name: 'Jane Smith', district: 'South', hasVoted: false },
  { id: '1003', phone: '9876543212', name: 'Alice Johnson', district: 'East', hasVoted: true },
  { id: '1004', phone: '9876543213', name: 'Bob Williams', district: 'West', hasVoted: false },
];

interface Candidate {
  id: string;
  name: string;
  votes: number;
  image: string;
  winner?: boolean;
}

interface VoterStatus {
  id: string;
  name: string;
  district: string;
  hasVoted: boolean;
}

interface VotingContextType {
  districts: string[];
  candidates: Record<string, Candidate[]>;
  votersStatus: VoterStatus[];
  selectedCandidate: string | null;
  publishedResults: boolean;
  getCandidatesByDistrict: (district: string) => Candidate[];
  selectCandidate: (candidateId: string) => void;
  submitVote: () => Promise<boolean>;
  getVotersByDistrict: (district: string) => VoterStatus[];
  markWinner: (district: string, candidateId: string) => void;
  publishResults: () => void;
  resetSelection: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [districts] = useState<string[]>(['North', 'South', 'East', 'West']);
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>(MOCK_CANDIDATES);
  const [votersStatus, setVotersStatus] = useState<VoterStatus[]>(MOCK_VOTERS);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [publishedResults, setPublishedResults] = useState<boolean>(false);

  // Load saved voting data from localStorage on initial load
  useEffect(() => {
    const savedCandidates = localStorage.getItem('candidates');
    const savedVotersStatus = localStorage.getItem('votersStatus');
    const savedPublishedResults = localStorage.getItem('publishedResults');
    
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    }
    
    if (savedVotersStatus) {
      setVotersStatus(JSON.parse(savedVotersStatus));
    }
    
    if (savedPublishedResults === 'true') {
      setPublishedResults(true);
    }
  }, []);

  const getCandidatesByDistrict = (district: string): Candidate[] => {
    return candidates[district] || [];
  };

  const selectCandidate = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };

  const submitVote = async (): Promise<boolean> => {
    if (!currentUser || !selectedCandidate) {
      toast.error("No candidate selected or user not logged in");
      return false;
    }
    
    // Check if user has already voted
    const voterIndex = votersStatus.findIndex(v => v.id === currentUser.id);
    if (voterIndex >= 0 && votersStatus[voterIndex].hasVoted) {
      toast.error("You have already cast your vote");
      return false;
    }
    
    // Find the candidate and increment votes
    let candidateFound = false;
    const updatedCandidates = { ...candidates };
    
    Object.keys(updatedCandidates).forEach(district => {
      if (district === currentUser.district) {
        updatedCandidates[district] = updatedCandidates[district].map(candidate => {
          if (candidate.id === selectedCandidate) {
            candidateFound = true;
            return { ...candidate, votes: candidate.votes + 1 };
          }
          return candidate;
        });
      }
    });
    
    if (!candidateFound) {
      toast.error("Selected candidate not found in your district");
      return false;
    }
    
    // Update voter status
    const updatedVotersStatus = votersStatus.map(voter => 
      voter.id === currentUser.id 
        ? { ...voter, hasVoted: true } 
        : voter
    );
    
    setCandidates(updatedCandidates);
    setVotersStatus(updatedVotersStatus);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    localStorage.setItem('votersStatus', JSON.stringify(updatedVotersStatus));
    
    return true;
  };

  const getVotersByDistrict = (district: string): VoterStatus[] => {
    return votersStatus.filter(voter => voter.district === district);
  };

  const markWinner = (district: string, candidateId: string) => {
    if (!district || !candidateId) return;
    
    const updatedCandidates = { ...candidates };
    updatedCandidates[district] = updatedCandidates[district].map(candidate => ({
      ...candidate,
      winner: candidate.id === candidateId
    }));
    
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
  };

  const publishResults = () => {
    setPublishedResults(true);
    localStorage.setItem('publishedResults', 'true');
    toast.success("Election results have been published");
  };
  
  const resetSelection = () => {
    setSelectedCandidate(null);
  };

  return (
    <VotingContext.Provider
      value={{
        districts,
        candidates,
        votersStatus,
        selectedCandidate,
        publishedResults,
        getCandidatesByDistrict,
        selectCandidate,
        submitVote,
        getVotersByDistrict,
        markWinner,
        publishResults,
        resetSelection,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};
