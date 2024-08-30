import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get(`${apiUrl}/detection-results`);
      res.status(response.status).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || error.message });
      } else {
        // Handle unexpected errors
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
