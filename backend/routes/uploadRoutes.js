import express from 'express';
import multer from 'multer';
import pkg from 'aws-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Destructure S3 from the imported AWS SDK package
const { S3 } = pkg;

const router = express.Router();

// Configure the AWS SDK
const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY, // Your AWS Access Key
  secretAccessKey: process.env.AWS_SECRET_KEY, // Your AWS Secret Access Key
  region: process.env.REGION // Your AWS Region
});

// Multer upload settings (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle file upload
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
  }

  // S3 upload parameters
  const params = {
    Bucket: process.env.BUCKET_NAME, // S3 bucket name
    Key: `${Date.now().toString()}-${req.file.originalname}`, // Unique file name for S3
    Body: req.file.buffer, // File data
    ContentType: req.file.mimetype, // MIME type of the file
  };

  try {
    // Upload the file to S3
    const data = await s3.upload(params).promise();
    
    // Return the file URL to the front-end
    res.status(200).json({ fileUrl: data.Location }); // The S3 URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error); // Log the error
    res.status(500).json({ error: 'Error uploading to S3', details: error.message });
  }
});

export default router;
