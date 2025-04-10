import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { CardData, StudentData } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Trash2, 
  IdCard as IdCardIcon,
  Menu,
  X
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onSelectCard: (card: StudentData) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Navbar({ onSelectCard, isOpen, setIsOpen }: NavbarProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { data: savedCards = [], refetch } = useQuery<CardData[]>({
    queryKey: ['/api/cards'],
  });

  const handleDeleteCard = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await apiRequest('DELETE', `/api/cards/${id}`);
      
      toast({
        title: "Card Deleted",
        description: "The ID card has been removed from your saved cards.",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the card. Please try again.",
        variant: "destructive"
      });
    }
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
      template: card.template,
      createdAt: card.createdAt
    };
    
    onSelectCard(studentData);
    
    toast({
      title: "Card Loaded",
      description: "The selected ID card has been loaded for editing.",
    });
    
    // Close sidebar on mobile after selecting
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button - Only visible on smaller screens */}
      <AnimatePresence>
        {(!isOpen && isMobile) && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-20 left-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-r-lg text-white shadow-lg"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMobile ? { x: '-100%' } : { opacity: 0 }}
            animate={isMobile ? { x: 0 } : { opacity: 1 }}
            exit={isMobile ? { x: '-100%' } : { opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-screen z-50 w-72 bg-white shadow-xl border-r border-gray-200 flex flex-col"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IdCardIcon className="h-5 w-5 text-white" />
                <h2 className="text-lg font-semibold text-white">Saved ID Cards</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)} 
                className="text-white hover:bg-blue-700/20"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gradient-to-b from-blue-50 to-indigo-50">
              {savedCards.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <IdCardIcon className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                  <p>No saved ID cards yet</p>
                  <p className="text-sm mt-2">Generate and save cards to see them here</p>
                </div>
              ) : (
                savedCards.map((card: CardData) => (
                  <Card 
                    key={card.id}
                    className="overflow-hidden border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
                    onClick={() => handleLoadCard(card)}
                  >
                    <div className={`h-2 ${card.template === 'classic' ? 'bg-blue-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}></div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm text-gray-800 truncate">{card.fullName}</h3>
                          <p className="text-xs text-gray-500">{`${card.classGrade} - ${card.division}`}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(card.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={(e) => handleDeleteCard(card.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* Close button at the bottom */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Close Sidebar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop - only on mobile */}
      <AnimatePresence>
        {(isOpen && isMobile) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}