'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface DetectionResult {
  bbox_xyxy: number[];
  confidence: number;
  label: string;
  track_id: number;
  first_frame: number;
  frame_indexes: number[];
}

interface RelevantFrame {
  track_id: number;
  image_base64: string;
}

interface QueryResponse {
  message: string;
  detections?: DetectionResult[];
  image_base64?: string;
  relevant_frames?: RelevantFrame[];
  results?: DetectionResult[];
}

const FileDetailsPage = () => {
  const params = useParams();
  const deviceId = params.deviceId as string;
  const [queryInput, setQueryInput] = useState('');
  const [processedData, setProcessedData] = useState<QueryResponse | null>(null);
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [labelCounts, setLabelCounts] = useState<{[key: string]: number}>({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

  const handleProcess = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<QueryResponse>(`${apiUrl}/getfile/${deviceId}`);
      setProcessedData(response.data);
      updateLabelCounts(response.data.detections || []);
    } catch (err) {
      setError('Error processing file');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleQuery = async () => {
    if (!queryInput.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<QueryResponse>(`${apiUrl}/getfile/${deviceId}/query/${queryInput}`);
      setQueryResponse(response.data);
      setQueryInput('');
    } catch (err) {
      setError('Error querying file');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${apiUrl}/delete/${deviceId}`);
      // Handle successful deletion (e.g., redirect to main page)
    } catch (err) {
      setError('Error deleting file');
      console.error(err);
    }
    setIsLoading(false);
  };

  const updateLabelCounts = (detections: DetectionResult[]) => {
    const counts: {[key: string]: number} = {};
    detections.forEach(detection => {
      counts[detection.label] = (counts[detection.label] || 0) + 1;
    });
    setLabelCounts(counts);
  };

  useEffect(() => {
    handleProcess();
  }, []);

  return (
    <div className="flex flex-col bg-gray-900 text-white min-h-screen pt-12">
      <div className="flex">
        {/* Left side - Buttons and Input */}
        <div className="w-1/4 p-4 border-r border-gray-700">
          <h1 className="text-2xl font-bold mb-4">File Details</h1>
          <p className="mb-4">Device ID: {deviceId}</p>
          <div className="space-y-4">
            <button
              onClick={handleProcess}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Process File
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete File
            </button>
            <div className="space-y-2">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter query"
                className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded"
              />
              <button
                onClick={handleQuery}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Query
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Label Counts</h2>
            <ul>
              {Object.entries(labelCounts).map(([label, count]) => (
                <li key={label}>{label}: {count}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right side - Processed Data and Query Results */}
        <div className="w-3/4 p-4 flex flex-col min-h-screen">
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {processedData && (
            <div className="flex-grow overflow-y-auto mb-4" style={{ maxHeight: 'calc(50vh - 100px)' }}>
              <h2 className="text-xl font-bold mb-4">Processed Data</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 text-left">Label</th>
                    <th className="p-2 text-left">Confidence</th>
                    <th className="p-2 text-left">Track ID</th>
                    <th className="p-2 text-left">First Frame</th>
                    <th className="p-2 text-left">Frame Indexes</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.detections && processedData.detections.length > 0 ? (
                    processedData.detections.map((result, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="p-2">{result.label}</td>
                        <td className="p-2">{result.confidence.toFixed(2)}</td>
                        <td className="p-2">{result.track_id}</td>
                        <td className="p-2">{result.first_frame}</td>
                        <td className="p-2">
                          {result.frame_indexes ? result.frame_indexes.join(', ') : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-2 text-center">No detections available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {queryResponse && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-4">Query Results</h2>
              <div className="flex flex-wrap">
                <div className="w-full mb-4">
                  {queryResponse.image_base64 && (
                    <img
                      src={queryResponse.image_base64}
                      alt="Query result"
                      className="max-w-full h-auto"
                    />
                  )}
                </div>
                {queryResponse.relevant_frames && queryResponse.relevant_frames.length > 0 && (
                  <div className="w-full flex flex-wrap">
                    {queryResponse.relevant_frames.map((frame, index) => (
                      <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-2">
                        <p className="text-sm">Track: {frame.track_id}</p>
                        <img
                          src={frame.image_base64}
                          alt={`Track ${frame.track_id}`}
                          className="border border-gray-700"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {queryResponse.results && queryResponse.results.length > 0 && (
                <div className="mt-4">
                  {queryResponse.results.map((result, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-bold">{result.label}</h3>
                      <p>Confidence: {result.confidence.toFixed(2)}</p>
                      <p>Bounding Box: {result.bbox_xyxy.join(', ')}</p>
                      <p>Track ID: {result.track_id}</p>
                      <p>First Frame: {result.first_frame}</p>
                      <p>Frame Indexes: {result.frame_indexes.join(', ')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDetailsPage;