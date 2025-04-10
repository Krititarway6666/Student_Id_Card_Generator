import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StudentData } from '@/types';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import { toPng } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { DownloadIcon, IdCardIcon, CheckIcon, XIcon } from 'lucide-react';

interface IDCardPreviewProps {
  studentData: StudentData | null;
  onClose?: () => void;
}

export default function IDCardPreview({ studentData, onClose }: IDCardPreviewProps) {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);
  const classicTemplateRef = useRef<HTMLDivElement>(null);
  const modernTemplateRef = useRef<HTMLDivElement>(null);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
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
      
      // Auto-hide preview after download
      handleClose();
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the ID card.",
        variant: "destructive"
      });
    }
  };
  
  // If no data, return null (don't show anything)
  if (!studentData) {
    return null;
  }
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <Card className="bg-white rounded-lg shadow-md relative">
      <button 
        onClick={handleClose}
        className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Close preview"
      >
        <XIcon className="h-4 w-4 text-gray-500" />
      </button>
      
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
