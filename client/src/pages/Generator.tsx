import { useState } from 'react';
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
      
      {/* Main container with responsive flex layout */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Navbar with saved cards */}
        <Navbar onSelectCard={setStudentData} />
        
        {/* Main content area */}
        <div className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
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
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Student ID Card Generator
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Create professional student ID cards with custom templates</p>
          </motion.header>

          {/* Responsive grid that changes to column on smaller screens */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Form column */}
            <motion.div 
              className="lg:col-span-3 mb-6 lg:mb-0 order-2 lg:order-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
                <StudentForm onSubmit={handleFormSubmit} existingData={studentData} />
              </div>
            </motion.div>

            {/* Preview column - shows on top for mobile */}
            <motion.div 
              className="lg:col-span-2 flex flex-col order-1 lg:order-2"
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
                <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
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