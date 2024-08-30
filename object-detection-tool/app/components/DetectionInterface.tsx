import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types'; // Adjust the path as needed

interface DetectionResult {
  id: number;
  device_id: string;
  file_name: string;
  file_path: string;
  label: string;
  confidence: number;
  bbox_xyxy: string;
}

const DetectionInterface: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [deviceId, setDeviceId] = useState('');
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!files) {
      setStatusMessage('No files selected');
      return;
    }

    const formData = new FormData();
    formData.append('device_id', deviceId);

    Array.from(files).forEach(file => {
      formData.append('file', file);
    });

    try {
      const response = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDetectionResults(response.data.results);
      setStatusMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setStatusMessage(`Error: ${axiosError.response?.data?.error || axiosError.message}`);
    }
  };

  const fetchDetectionResults = async () => {
    try {
      const response = await axios.get(`${apiUrl}/detection-results`);
      setDetectionResults(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setStatusMessage(`Error fetching detection results: ${axiosError.response?.data?.error || axiosError.message}`);
    }
  };

  return (
    <div className="detection-interface p-4">
      <h2 className="text-xl font-bold mb-4">Object Detection Interface</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700">Device ID</label>
          <input
            id="deviceId"
            type="text"
            placeholder="Enter Device ID"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Upload Files</label>
          <input
            id="fileUpload"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="mt-1 block w-full"
            multiple
          />
        </div>
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Upload and Detect
        </button>
      </form>

      <button onClick={fetchDetectionResults} className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
        Fetch Detection Results
      </button>

      {statusMessage && <p className="mt-4">{statusMessage}</p>}

      <div className="detection-results mt-4">
        {detectionResults.length > 0 ? (
          <ul>
            {detectionResults.map(result => (
              <li key={result.id} className="border-b py-2">
                <strong>Device ID:</strong> {result.device_id}<br />
                <strong>File Name:</strong> {result.file_name}<br />
                <strong>Label:</strong> {result.label}<br />
                <strong>Confidence:</strong> {result.confidence}<br />
                <strong>BBox:</strong> {result.bbox_xyxy}
              </li>
            ))}
          </ul>
        ) : (
          <p>No detection results available.</p>
        )}
      </div>
    </div>
  );
};

export default DetectionInterface;
