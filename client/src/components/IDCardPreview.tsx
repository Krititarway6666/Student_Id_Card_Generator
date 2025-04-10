import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StudentData } from '@/types';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import { toPng } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { DownloadIcon, IdCardIcon, CheckIcon } from 'lucide-react';

interface IDCardPreviewProps {
  studentData: StudentData | null;
}

export default function IDCardPreview({ studentData }: IDCardPreviewProps) {
  const { toast } = useToast();
  const classicTemplateRef = useRef<HTMLDivElement>(null);
  const modernTemplateRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadCard = async () => {
    if (!studentData) return;
    
    try {
      const templateRef = studentData.template === 'classic' 
        ? classicTemplateRef.current 
        : modernTemplateRef.current;
      
      if (!templateRef) return;
      
      const dataUrl = await toPng(templateRef, { quality: 0.95 });
      
      // Create a download link and trigger click
      const link = document.createElement('a');
      link.download = `${studentData.fullName.replace(/\s+/g, '_')}_ID_Card.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Download Complete",
        description: "Your ID card has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the ID card.",
        variant: "destructive"
      });
    }
  };
  
  // If no data, show empty state
  if (!studentData) {
    return (
      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-96">
          <div className="text-gray-400 mb-4">
            <IdCardIcon className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No ID Card Generated Yet</h3>
          <p className="text-gray-500 mb-4">Fill out the form and click "Generate ID Card" to see a preview here.</p>
          <div className="space-y-3 text-sm text-gray-600 max-w-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center mr-2">
                <CheckIcon className="h-4 w-4 text-blue-500" />
              </div>
              <p>Fill in all required student information including a photo</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center mr-2">
                <CheckIcon className="h-4 w-4 text-blue-500" />
              </div>
              <p>Choose between Classic or Modern ID card templates</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center mr-2">
                <CheckIcon className="h-4 w-4 text-blue-500" />
              </div>
              <p>Download your generated ID card as a PNG image</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">ID Card Preview</h2>
          <Button onClick={handleDownloadCard}>
            <DownloadIcon className="h-4 w-4 mr-2" /> Download as PNG
          </Button>
        </div>
        
        <div className="flex justify-center">
          {/* Render appropriate template based on selection */}
          {studentData.template === 'classic' ? (
            <ClassicTemplate studentData={studentData} forwardedRef={classicTemplateRef} />
          ) : (
            <ModernTemplate studentData={studentData} forwardedRef={modernTemplateRef} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
