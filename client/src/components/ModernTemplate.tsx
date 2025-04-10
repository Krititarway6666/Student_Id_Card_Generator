import { QRCode } from 'react-qrcode-logo';
import { StudentData } from '@/types';

interface ModernTemplateProps {
  studentData: StudentData;
  forwardedRef?: React.RefObject<HTMLDivElement>;
}

export default function ModernTemplate({ studentData, forwardedRef }: ModernTemplateProps) {
  return (
    <div
      ref={forwardedRef}
      className="w-80 rounded-lg overflow-hidden shadow-lg border border-gray-200"
      style={{ height: '500px' }}
    >
      {/* Card Background */}
      <div className="h-full bg-gradient-to-b from-indigo-600 to-indigo-500 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-400 opacity-20 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-700 opacity-20 rounded-full -ml-20 -mb-20"></div>
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="p-3 text-center">
            <div className="text-md font-medium uppercase tracking-wide">Student ID</div>
            <div className="text-xs mt-1 opacity-75">Academic Year 2023-24</div>
          </div>
          
          {/* Content */}
          <div className="flex-grow flex flex-col items-center px-4 pt-2">
            {/* Photo Area */}
            <div className="h-32 w-24 bg-white rounded-lg overflow-hidden border-2 border-white shadow-md mb-2">
              <img 
                src={studentData.photo || "https://placehold.co/112x144/f3f4f6/a3a3a3?text=Photo"} 
                alt="Student Photo" 
                className="w-full h-full object-cover object-center" 
              />
            </div>
            
            {/* Student Info */}
            <h3 className="text-lg font-bold mb-1">{studentData.fullName}</h3>
            <p className="text-xs opacity-75 mb-2">{`${studentData.classGrade} - ${studentData.division}`}</p>
            
            {/* Student Details */}
            <div className="bg-indigo-700 bg-opacity-30 w-full rounded-lg p-2 text-xs mb-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="flex flex-col">
                  <span className="opacity-75 text-xs">Roll Number</span>
                  <span className="font-medium">{studentData.rollNumber}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-75 text-xs">Rack Number</span>
                  <span className="font-medium">{studentData.rackNumber || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-75 text-xs">Bus Route</span>
                  <span className="font-medium">{studentData.busRoute || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-75 text-xs">Allergies</span>
                  <span className="font-medium text-xs">{studentData.allergies?.length ? studentData.allergies.join(', ') : 'None'}</span>
                </div>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="flex justify-center mb-2">
              <div className="bg-white rounded-md p-1 shadow-sm">
                <QRCode 
                  value={JSON.stringify({
                    fullName: studentData.fullName,
                    rollNumber: studentData.rollNumber,
                    classGrade: studentData.classGrade,
                    division: studentData.division
                  })}
                  size={60}
                  qrStyle="squares"
                  eyeRadius={3}
                  quietZone={2}
                />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-2 text-center opacity-75">
            <div className="text-[10px]">School Name - Address</div>
            <div className="text-[9px]">Phone: 123-456-7890 | www.schoolwebsite.edu</div>
          </div>
        </div>
      </div>
    </div>
  );
}
