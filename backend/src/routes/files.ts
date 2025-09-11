import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import File from '../models/File';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Create - Upload file
router.post('/upload', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileDoc = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: (req as any).userId
    });

    await fileDoc.save();
    res.status(201).json(fileDoc);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Read - Get all files
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const files = await File.find({ uploadedBy: (req as any).userId })
      .populate('uploadedBy', 'username');
    res.json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Read - Get single file
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update - Change file name
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { originalName } = req.body;
    
    if (!originalName || originalName.trim() === '') {
      return res.status(400).json({ message: 'New filename is required' });
    }

    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if the file belongs to the authenticated user
    if (file.uploadedBy.toString() !== (req as any).userId) {
      return res.status(403).json({ message: 'Unauthorized to update this file' });
    }

    // Update the original name
    file.originalName = originalName.trim();
    await file.save();

    res.json(file);
  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete file
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;