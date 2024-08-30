import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';

interface Entry {
  device_id: string;
  file_path: string;
  timestamp: string; // Use timestamp to derive date and time
}

interface HistoryItem {
  device_id: string;
  file_path: string;
  images_count: number;
  index_file_exists: boolean;
  json_file_exists: boolean;
}

const EntriesDisplay: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

  const fetchEntries = async () => {
    try {
      const response = await axios.get<Entry[]>(`${apiUrl}/getfile`);
      setEntries(response.data);
    } catch (error) {
      setError('Error fetching data');
      console.error(error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get<{ devices: HistoryItem[] }>(`${apiUrl}/show_history`);
      setHistory(response.data.devices);
    } catch (error) {
      setError('Error fetching history');
      console.error(error);
    }
  };

  const deleteDeviceData = async (deviceId: string) => {
    try {
      await axios.delete(`${apiUrl}/delete_device_data/${deviceId}`);
      fetchHistory(); // Refresh the history after successful deletion
    } catch (error) {
      console.error('Error deleting device data:', error);
      setError('Error deleting device data');
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchHistory();
  }, []);

  const formatDateAndTime = (timestamp: string) => {
    const dateObj = new Date(timestamp);

    // Adjust for IST (UTC+5:30)
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    dateObj.setTime(dateObj.getTime() + istOffset);

    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return { date, time };
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="entries-display p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Entries</h2>
        <button
          onClick={fetchEntries}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          aria-label="Refresh"
        >
          Refresh
        </button>
      </div>
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr className="bg-gray-800">
            <th className="py-2 px-4 text-left">Device ID</th>
            <th className="py-2 px-4 text-left">File Path</th>
            <th className="py-2 px-4 text-left">Date</th> {/* Separate date header */}
            <th className="py-2 px-4 text-left">Time</th> {/* Separate time header */}
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const { date, time } = formatDateAndTime(entry.timestamp);
            return (
              <CardComponent
                key={entry.device_id}
                deviceId={entry.device_id}
                filePath={entry.file_path}
                date={date} // Pass date
                time={time} // Pass time
                onDelete={async (deviceId: string) => {
                  try {
                    await axios.delete(`${apiUrl}/delete/${deviceId}`);
                    fetchEntries();
                  } catch (error) {
                    console.error('Error deleting entry:', error);
                    setError('Error deleting entry');
                  }
                }}
              />
            );
          })}
        </tbody>
      </table>
      
      {/* History Section */}
      <div className="history-section mt-8">
        <h2 className="text-xl font-bold mb-2">History</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-2 px-4 text-left">Device ID</th>
              <th className="py-2 px-4 text-left">File Path</th>
              <th className="py-2 px-4 text-left">Images Count</th>
              <th className="py-2 px-4 text-left">Index File Exists</th>
              <th className="py-2 px-4 text-left">JSON File Exists</th>
              <th className="py-2 px-4 text-left">Actions</th> {/* New actions column */}
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.device_id} className="border-t border-gray-700 text-xs">
                <td className="p-2">{item.device_id}</td>
                <td className="p-2 truncate">{item.file_path}</td>
                <td className="p-2">{item.images_count === 0 ? '1' : item.images_count}</td>
                <td className="p-2">{item.index_file_exists ? 'Yes' : 'No'}</td>
                <td className="p-2">{item.json_file_exists ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteDeviceData(item.device_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                    aria-label={`Delete data for ${item.device_id}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntriesDisplay;
