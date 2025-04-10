import { useState } from 'react';
import StudentForm from '@/components/StudentForm';
import IDCardPreview from '@/components/IDCardPreview';
import SavedCards from '@/components/SavedCards';
import { StudentData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Generator() {
  const { toast } = useToast();
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Smart Student ID Card Generator
          </h1>
          <p className="text-gray-600 mt-2">Create professional student ID cards with custom templates</p>
        </header>

        <div className="lg:grid lg:grid-cols-5 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <StudentForm onSubmit={handleFormSubmit} existingData={studentData} />
            <SavedCards onSelectCard={setStudentData} />
          </div>

          {/* Right column - Preview */}
          <div className="lg:col-span-2 flex flex-col">
            {showPreview ? (
              <IDCardPreview 
                studentData={studentData} 
                onClose={handlePreviewClose} 
              />
            ) : studentData && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 mb-4">ID card preview is hidden</p>
                <Button onClick={handleShowPreview} className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" /> Show Preview
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}