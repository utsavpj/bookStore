import multer from 'multer';

// Use memory storage for buffer
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

export default upload;
