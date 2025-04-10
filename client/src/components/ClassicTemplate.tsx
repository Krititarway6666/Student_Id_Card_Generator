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
      <div className="bg-blue-800 text-white p-4 text-center">
        <div className="text-2xl font-bold">SCHOOL NAME</div>
        <div className="text-sm mt-1">STUDENT IDENTIFICATION CARD</div>
      </div>
      
      {/* Student Photo */}
      <div className="flex justify-center -mt-5">
        <div className="h-36 w-28 bg-white border-4 border-white rounded-md overflow-hidden shadow-md">
          <img 
            src={studentData.photo || "https://placehold.co/112x144/f3f4f6/a3a3a3?text=Photo"} 
            alt="Student Photo" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      </div>
      
      {/* Student Details */}
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{studentData.fullName}</h3>
          <p className="text-gray-600">{`${studentData.classGrade} - ${studentData.division}`}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
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
            <span className="text-right">{studentData.allergies?.length ? studentData.allergies.join(', ') : 'None'}</span>
          </div>
        </div>
      </div>
      
      {/* QR Code */}
      <div className="p-4 flex justify-center">
        <QRCode 
          value={JSON.stringify({
            fullName: studentData.fullName,
            rollNumber: studentData.rollNumber,
            classGrade: studentData.classGrade,
            division: studentData.division,
            allergies: studentData.allergies,
            rackNumber: studentData.rackNumber,
            busRoute: studentData.busRoute
          })}
          size={96}
          qrStyle="squares"
          eyeRadius={5}
          quietZone={10}
        />
      </div>
    </div>
  );
}
