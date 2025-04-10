import { useState } from 'react';
import StudentForm from '@/components/StudentForm';
import IDCardPreview from '@/components/IDCardPreview';
import SavedCards from '@/components/SavedCards';
import { StudentData } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  const handleFormSubmit = (formData: StudentData) => {
    setStudentData(formData);
    
    toast({
      title: "ID Card Generated",
      description: "Your student ID card has been generated successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Smart Student ID Card Generator</h1>
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
          <IDCardPreview studentData={studentData} />
        </div>
      </div>
    </div>
  );
}
