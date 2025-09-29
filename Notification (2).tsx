import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ type, message }) => {
  const { t } = useTranslation();
  
  return (
    <div
      className={`fixed top-4 right-4 z-[200] p-4 rounded-lg shadow-lg animate-fade-in-out ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <div className="flex items-center gap-2 text-white">
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Notification;