import { useState, useEffect } from 'react';
import StudentForm from '@/components/StudentForm';
import IDCardPreview from '@/components/IDCardPreview';
import Navbar from '@/components/Navbar';
import { StudentData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, ArrowLeft } from 'lucide-react';
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
  
  // Update sidebar state based on screen size
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
      
      {/* Navbar component */}
      <Navbar 
        onSelectCard={setStudentData} 
        isOpen={navbarOpen} 
        setIsOpen={setNavbarOpen} 
      />
      
      {/* Main content - shifted based on navbar state */}
      <div className={`transition-all duration-300 ${navbarOpen ? 'md:ml-72 lg:ml-80 xl:ml-96' : 'mx-auto'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link href="/">
              <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <motion.header 
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Student ID Card Generator
            </h1>
            <p className="text-gray-600 mt-2">Create professional student ID cards with custom templates</p>
          </motion.header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form column - responsive based on screen size */}
            <motion.div 
              className="order-2 md:order-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <StudentForm onSubmit={handleFormSubmit} existingData={studentData} />
              </div>
            </motion.div>

            {/* Preview column - shows on top for mobile */}
            <motion.div 
              className="order-1 md:order-2"
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
                <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-100">
                  <p className="text-gray-500 mb-4">ID card preview is hidden</p>
                  <Button onClick={handleShowPreview} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    <PlusIcon className="h-4 w-4 mr-2" /> Show Preview
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}