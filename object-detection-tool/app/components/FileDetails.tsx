"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface FileDetailsProps {
  deviceId: string;
}

interface Detection {
  bbox_xyxy: number[];
  confidence: number;
  label: string;
}

const FileDetails: React.FC<FileDetailsProps> = ({ deviceId }) => {
  const [fileData, setFileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getfile/${deviceId}`);
        setFileData(response.data);
        setImageUrl(response.data.image_path);
      } catch (error) {
        setError('Error fetching file details');
        console.error(error);
      }
    };

    fetchFileDetails();
  }, [deviceId, apiUrl]);

  if (error) return <div>{error}</div>;
  if (!fileData) return <div>Loading...</div>;

  return (
    <div className="file-details">
      <h2 className="text-xl font-bold mb-4">File Details for Device ID: {deviceId}</h2>
      {imageUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Annotated Image:</h3>
          <Image src={imageUrl} alt="Annotated" width={600} height={450} />
        </div>
      )}
      <h3 className="text-lg font-semibold mt-4">Detections:</h3>
      <div className="space-y-4">
        {fileData.results.map((detection: Detection, index: number) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <p><strong>Bounding Box:</strong> {detection.bbox_xyxy.join(', ')}</p>
            <p><strong>Confidence:</strong> {detection.confidence}</p>
            <p><strong>Label:</strong> {detection.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDetails;
