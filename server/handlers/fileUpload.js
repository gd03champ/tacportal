//this logic is now in the server.js file and this code not imported anywhere
//deprecated code


import multer from 'multer';
const app = express();
const port = 3000; // Or any port you prefer

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory for storing files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original filename
  }
});

const upload = multer({ storage: storage });

// Define the file upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  res.json({ filename: req.file.filename, url: `http://localhost:${port}/uploads/${req.file.filename}` });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
