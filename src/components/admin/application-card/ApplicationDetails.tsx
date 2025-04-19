
interface ApplicationDetailsProps {
  email: string;
  experienceYears: number;
  teachingStyle: string;
  motivation: string;
}

export const ApplicationDetails = ({ 
  email, 
  experienceYears, 
  teachingStyle, 
  motivation 
}: ApplicationDetailsProps) => (
  <>
    <div>
      <p className="font-semibold">Email:</p>
      <p>{email}</p>
    </div>
    <div>
      <p className="font-semibold">Experience:</p>
      <p>{experienceYears} years</p>
    </div>
    <div>
      <p className="font-semibold">Teaching Style:</p>
      <p className="text-gray-600">{teachingStyle}</p>
    </div>
    <div>
      <p className="font-semibold">Motivation:</p>
      <p className="text-gray-600">{motivation}</p>
    </div>
  </>
);
