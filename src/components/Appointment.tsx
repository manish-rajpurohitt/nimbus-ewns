import Link from "next/link";
import Image from "next/image";

interface AppointmentProps {
  businessData: {
    business: {
      enableAppointments?: boolean;
      staticData?: {
        home?: {
          appointment?: {
            description: string;
            buttonText: string;
            _id: string;
          };
        };
      };
    };
  };
}

export default function Appointment({ businessData }: AppointmentProps) {
  if (!businessData?.business?.enableAppointments) {
    return null;
  }

  const appointmentData = businessData?.business?.staticData?.home?.appointment;

  if (!appointmentData) {
    return null;
  }

  return (
    <div className="appointment-container">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://ewns-albums.s3.ap-south-1.amazonaws.com/website-images/1731170475467-apoment.png"
          alt="Appointment Background"
          fill
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
      </div>
      <div className="appointment-content">
        <p className="appointment-text">{appointmentData.description}</p>
        <Link href="/appointment" className="appointment-button">
          {appointmentData.buttonText}
        </Link>
      </div>
    </div>
  );
}
