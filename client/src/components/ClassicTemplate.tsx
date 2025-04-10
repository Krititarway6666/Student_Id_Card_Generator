import { QRCode } from 'react-qrcode-logo';
import { StudentData } from '@/types';

interface ClassicTemplateProps {
  studentData: StudentData;
  forwardedRef?: React.RefObject<HTMLDivElement>;
}

export default function ClassicTemplate({ studentData, forwardedRef }: ClassicTemplateProps) {
  return (
    <div 
      ref={forwardedRef}
      className="w-80 rounded-lg overflow-hidden shadow-lg border border-gray-200"
      style={{ height: '500px' }}
    >
      {/* Card Header */}
      <div className="bg-blue-800 text-white p-3 text-center">
        <div className="text-xl font-bold">SCHOOL NAME</div>
        <div className="text-xs mt-1">STUDENT IDENTIFICATION CARD</div>
      </div>
      
      {/* Student Photo */}
      <div className="flex justify-center -mt-4">
        <div className="h-32 w-24 bg-white border-3 border-white rounded-md overflow-hidden shadow-md">
          <img 
            src={studentData.photo || "https://placehold.co/112x144/f3f4f6/a3a3a3?text=Photo"} 
            alt="Student Photo" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      </div>
      
      {/* Student Details */}
      <div className="p-3">
        <div className="text-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">{studentData.fullName}</h3>
          <p className="text-sm text-gray-600">{`${studentData.classGrade} - ${studentData.division}`}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-2 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Roll Number:</span>
            <span>{studentData.rollNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Rack Number:</span>
            <span>{studentData.rackNumber || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Bus Route:</span>
            <span>{studentData.busRoute || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Allergies:</span>
            <span className="text-right text-xs">{studentData.allergies?.length ? studentData.allergies.join(', ') : 'None'}</span>
          </div>
        </div>
      </div>
      
      {/* QR Code */}
      <div className="p-2 flex justify-center">
        <div className="flex justify-center items-center bg-white p-1 rounded-md border border-gray-200">
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
  );
}
