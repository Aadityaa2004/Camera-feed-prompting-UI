import React from 'react';
import { useRouter } from 'next/navigation';

interface CardComponentProps {
  deviceId: string;
  filePath: string;
  date: string; // Separate date prop
  time: string; // Separate time prop
  onDelete: (deviceId: string) => void;
}

const CardComponent: React.FC<CardComponentProps> = ({
  deviceId,
  filePath,
  date,
  time,
  onDelete,
}) => {
  const router = useRouter(); // Next.js router

  const handleView = () => {
    router.push(`/pages/files/${deviceId}`);
  };

  return (
    <tr className="border-b border-gray-700">
      <td className="py-2 px-4">{deviceId}</td>
      <td className="py-2 px-4">{filePath}</td>
      <td className="py-2 px-4">{date}</td> {/* Display date */}
      <td className="py-2 px-4">{time}</td> {/* Display time */}
      <td className="py-2 px-4">
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs "
            onClick={handleView}
          >
            View
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            onClick={() => onDelete(deviceId)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CardComponent;
