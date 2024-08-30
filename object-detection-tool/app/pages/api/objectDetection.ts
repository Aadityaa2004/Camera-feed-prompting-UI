import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '../../types'; // Adjust the path as needed

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Received POST request to /object-detection');
    console.log('Request body:', req.body);

    try {
      const response = await axios.post(`${apiUrl}/object-detection`, req.body);
      console.log('Response from backend:', response.data);
      res.status(response.status).json(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('Error calling backend:', axiosError);
      res.status(axiosError.response?.status || 500).json({
        error: axiosError.response?.data?.error || axiosError.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
