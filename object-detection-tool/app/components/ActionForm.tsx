"use client";

import React, { useState } from 'react';
import axios from 'axios';

interface ActionFormProps {
  apiUrl: string;
  onToast: (message: string) => void;
  onClose: () => void; // Add this prop
}

const ActionForm: React.FC<ActionFormProps> = ({ apiUrl, onToast, onClose }) => {
  const [deviceId, setDeviceId] = useState('');
  const [filePath, setFilePath] = useState('');
  const [action, setAction] = useState<'push' | 'delete'>('push');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (action === 'push') {
        const response = await axios.post(`${apiUrl}/push`, 
          { 
            device_id: deviceId, 
            file_path: filePath 
          }, 
          { 
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        onToast('Data has been pushed successfully');
      } else if (action === 'delete') {
        const response = await axios.delete(`${apiUrl}/delete/${deviceId}`);
        onToast('Data has been deleted successfully');
      }
      setDeviceId('');
      setFilePath('');
      onClose(); // Notify parent component to close the form
    } catch (error) {
      console.error('Error performing action:', error);
      onToast('Error performing action');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Manage Data</h2>
      <div>
        <label htmlFor="deviceId" className="block text-sm font-medium">Device ID</label>
        <input
          type="text"
          id="deviceId"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="block w-full border border-gray-300 rounded p-2 text-black"
          required
        />
      </div>
      {action === 'push' && (
        <div>
          <label htmlFor="filePath" className="block text-sm font-medium">File Path</label>
          <input
            type="text"
            id="filePath"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="block w-full border border-gray-300 rounded p-2 text-black"
            required
          />
        </div>
      )}
      <div>
        <label htmlFor="action" className="block text-sm font-medium">Action</label>
        <select
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value as 'push' | 'delete')}
          className="block w-full border border-gray-300 rounded p-2 text-black"
          required
        >
          <option value="push">Push Data</option>
          <option value="delete">Delete Data</option>
        </select>
      </div>
      <button
        type="submit"
        className={`bg-${action === 'push' ? 'blue' : 'red'}-500 text-white p-2 rounded hover:bg-${action === 'push' ? 'blue' : 'red'}-600 transition duration-300`}
      >
        {action === 'push' ? 'Push Data' : 'Delete Data'}
      </button>
      {message && <div className="mt-4 text-red-500">{message}</div>}
    </form>
  );
};

export default ActionForm;
