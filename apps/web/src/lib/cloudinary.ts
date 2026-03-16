import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'technetics-hackathon',
    format: async (req, file) => 'png', // or other formats
    public_id: (req, file) => file.originalname.split('.')[0],
  } as any,
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
