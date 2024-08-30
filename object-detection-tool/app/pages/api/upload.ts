import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, Files, Fields } from 'formidable';
import path from 'path';
import { IncomingMessage } from 'http';

// Configure formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new IncomingForm() as unknown as {
    uploadDir: string;
    keepExtensions: boolean;
    parse: (req: IncomingMessage, callback: (err: any, fields: Fields, files: Files) => void) => void;
  };

  form.uploadDir = path.join(process.cwd(), '/public/uploads');
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error processing file' });
      return;
    }

    // Check if files.file is defined and is an array
    if (!files.file || !Array.isArray(files.file)) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const file = files.file[0];
    if (!file.filepath) {
      res.status(400).json({ error: 'File path is missing' });
      return;
    }

    const filePath = file.filepath;

    // Here you can process the file (e.g., run object detection)
    // For now, just return the file path
    res.status(200).json({ message: 'File uploaded successfully', filePath });
  });
};

export default uploadHandler;
