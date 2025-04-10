import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StudentData, CardData } from '@/types';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon, EditIcon, TrashIcon } from 'lucide-react';

interface SavedCardsProps {
  onSelectCard: (card: StudentData) => void;
}

export default function SavedCards({ onSelectCard }: SavedCardsProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const { data: savedCards = [], isLoading, error } = useQuery({
    queryKey: ['/api/cards'],
  });
  
  const deleteCardMutation = useMutation({
    mutationFn: async (cardId: number) => {
      const response = await apiRequest('DELETE', `/api/cards/${cardId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      toast({
        title: "Card Deleted",
        description: "The ID card has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete the ID card.",
        variant: "destructive"
      });
    }
  });
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleLoadCard = (card: CardData) => {
    const studentData: StudentData = {
      fullName: card.fullName,
      rollNumber: card.rollNumber,
      classGrade: card.classGrade,
      division: card.division,
      allergies: card.allergies,
      rackNumber: card.rackNumber,
      busRoute: card.busRoute,
      photo: card.photo,
      template: card.template as 'classic' | 'modern',
      createdAt: card.createdAt,
    };
    
    onSelectCard(studentData);
    
    toast({
      title: "Card Loaded",
      description: "The selected ID card has been loaded to the editor.",
    });
  };
  
  const handleDeleteCard = (cardId: number) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCardMutation.mutate(cardId);
    }
  };
  
  // Don't show if there are no saved cards
  if (savedCards.length === 0 && !isLoading) {
    return null;
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mt-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Previously Generated Cards</h2>
          </div>
          <div className="py-4 text-center text-gray-500">
            Loading saved cards...
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Card className="bg-white rounded-lg shadow-md mt-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Previously Generated Cards</h2>
          </div>
          <div className="py-4 text-center text-red-500">
            Error loading saved cards. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white rounded-lg shadow-md mt-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Previously Generated Cards</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-gray-700"
            onClick={toggleExpanded}
          >
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="space-y-4">
            {savedCards.map((card: CardData) => {
              // Format date
              const createdDate = new Date(card.createdAt);
              const formattedDate = createdDate.toLocaleDateString();
              
              return (
                <div 
                  key={card.id} 
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3 overflow-hidden">
                      <img src={card.photo} alt="Student" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{card.fullName}</p>
                      <p className="text-sm text-gray-500">{`${card.classGrade}-${card.division} • Created on ${formattedDate}`}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-800" 
                      title="Load to Editor"
                      onClick={() => handleLoadCard(card)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-800" 
                      title="Delete Card"
                      onClick={() => handleDeleteCard(card.id)}
                      disabled={deleteCardMutation.isPending}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
