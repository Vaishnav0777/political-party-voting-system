
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart3, CheckCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui-custom/GlassCard';
import AnimatedTransition from '@/components/ui-custom/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';
import { useVoting } from '@/context/VotingContext';
import { toast } from '@/components/ui/sonner';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('voters');
  const { isAdmin, logout } = useAuth();
  const { 
    districts, 
    getVotersByDistrict, 
    getCandidatesByDistrict,
    markWinner, 
    publishResults,
    publishedResults
  } = useVoting();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
    }
  }, [isAdmin, navigate]);

  const handleMarkWinner = (district: string, candidateId: string) => {
    markWinner(district, candidateId);
    toast.success(`Candidate marked as winner for ${district} district`);
  };

  const handlePublishResults = () => {
    publishResults();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <Header />
      
      <main className="py-8 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Election Administration</h1>
            <p className="text-gray-600 text-sm">
              Manage voters, view results, and publish election outcomes
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
        
        <Tabs 
          defaultValue="voters" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="voters" className="flex items-center gap-2">
              <Users size={16} />
              <span>Voter Status</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span>Vote Counts</span>
            </TabsTrigger>
            <TabsTrigger value="publish" className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Publish Results</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voters" className="space-y-8">
            {districts.map((district) => (
              <AnimatedTransition key={district} animation="fade">
                <GlassCard>
                  <h3 className="text-lg font-medium mb-4">{district} District</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-4 text-left">Voter ID</th>
                          <th className="py-2 px-4 text-left">Name</th>
                          <th className="py-2 px-4 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getVotersByDistrict(district).map((voter) => (
                          <tr key={voter.id} className="border-t border-gray-100">
                            <td className="py-3 px-4">{voter.id}</td>
                            <td className="py-3 px-4">{voter.name}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block py-1 px-2 rounded-full text-xs ${
                                voter.hasVoted 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {voter.hasVoted ? 'Voted' : 'Not Voted'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </AnimatedTransition>
            ))}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-8">
            {districts.map((district) => (
              <AnimatedTransition key={district} animation="fade">
                <GlassCard>
                  <h3 className="text-lg font-medium mb-4">{district} District</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-4 text-left">Candidate</th>
                          <th className="py-2 px-4 text-left">Votes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCandidatesByDistrict(district).map((candidate) => (
                          <tr key={candidate.id} className="border-t border-gray-100">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={candidate.image}
                                  alt={candidate.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <span>{candidate.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">{candidate.votes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </AnimatedTransition>
            ))}
          </TabsContent>
          
          <TabsContent value="publish" className="space-y-8">
            {districts.map((district) => (
              <AnimatedTransition key={district} animation="fade">
                <GlassCard>
                  <h3 className="text-lg font-medium mb-4">{district} District</h3>
                  
                  <div className="space-y-4">
                    {getCandidatesByDistrict(district).map((candidate) => (
                      <div key={candidate.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p>{candidate.name}</p>
                            <p className="text-xs text-gray-500">Votes: {candidate.votes}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {candidate.winner && (
                            <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">
                              Winner
                            </span>
                          )}
                          
                          <Button
                            size="sm"
                            variant={candidate.winner ? "default" : "outline"}
                            onClick={() => handleMarkWinner(district, candidate.id)}
                            disabled={publishedResults}
                          >
                            {candidate.winner ? 'Selected' : 'Select Winner'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </AnimatedTransition>
            ))}
            
            <div className="flex justify-end mt-8">
              <Button
                onClick={handlePublishResults}
                disabled={publishedResults}
                className="min-w-[200px]"
              >
                {publishedResults ? 'Results Published' : 'Publish Results'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
