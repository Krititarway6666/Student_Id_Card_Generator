import { useState, useEffect } from 'react';
import StudentForm from '@/components/StudentForm';
import IDCardPreview from '@/components/IDCardPreview';
import Navbar from '@/components/Navbar';
import { StudentData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, ArrowLeft, MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Generator() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(!isMobile);
  
  // Update Navbar state when screen size changes
  useEffect(() => {
    setNavbarOpen(!isMobile);
  }, [isMobile]);

  const handleFormSubmit = (formData: StudentData) => {
    setStudentData(formData);
    setShowPreview(true);
    
    toast({
      title: "ID Card Generated",
      description: "Your student ID card has been generated successfully.",
    });
  };
  
  const handlePreviewClose = () => {
    setShowPreview(false);
  };
  
  const handleShowPreview = () => {
    if (studentData) {
      setShowPreview(true);
    } else {
      toast({
        title: "No ID Card Available",
        description: "Fill out the form first to generate an ID card.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background gradient shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[30%] w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[20%] w-96 h-96 rounded-full bg-indigo-200/20 blur-3xl"></div>
      </div>
      
      {/* Container with transition for content shifting */}
      <div className="flex min-h-screen">
        {/* Navbar with saved cards */}
        <div className={`${navbarOpen ? 'w-0 md:w-72 lg:w-80 xl:w-96' : 'w-0'} transition-all duration-300`}>
          <Navbar onSelectCard={setStudentData} />
        </div>
        
        {/* Main content area - conditional classes for centering */}
        <div className={`flex-1 transition-all duration-300 ${navbarOpen ? 'md:ml-0' : 'mx-auto'}`}>
          <div className="w-full mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <Link href="/">
                <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800 text-sm md:text-base">
                  <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Back to Home
                </Button>
              </Link>
              
              {/* Mobile menu toggle button */}
              {isMobile && !navbarOpen && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setNavbarOpen(true)}
                  className="flex items-center md:hidden"
                >
                  <MenuIcon className="h-4 w-4 mr-2" />
                  Menu
                </Button>
              )}
            </div>
            
            <motion.header 
              className="mb-6 md:mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Student ID Card Generator
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-xs sm:text-sm md:text-base">Create professional student ID cards with custom templates</p>
            </motion.header>

            {/* Responsive grid that changes to column on smaller screens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
              {/* Form column - width responsive based on screen size */}
              <motion.div 
                className="lg:col-span-7 xl:col-span-7 mb-6 lg:mb-0 order-2 lg:order-1 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
                  <StudentForm onSubmit={handleFormSubmit} existingData={studentData} />
                </div>
              </motion.div>

              {/* Preview column - shows on top for mobile */}
              <motion.div 
                className="lg:col-span-5 xl:col-span-5 flex flex-col order-1 lg:order-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {showPreview ? (
                  <IDCardPreview 
                    studentData={studentData} 
                    onClose={handlePreviewClose} 
                  />
                ) : studentData && (
                  <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center border border-gray-100">
                    <p className="text-gray-500 mb-3 md:mb-4 text-sm md:text-base">ID card preview is hidden</p>
                    <Button onClick={handleShowPreview} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm md:text-base">
                      <PlusIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Show Preview
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}