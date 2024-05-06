import express from 'express';
import mongoose, { get } from 'mongoose';
import bodyParser from "body-parser";
import cors  from "cors";
import multer from 'multer';

//auth handlers
import login from './auth/login.js';
import register from './auth/register.js';
import logout from './auth/logout.js';
import requireAuth from './middlewares/reqAuth.js';
import getUser from './auth/getUser.js';

//other handlers
import getTacs from './handlers/getTacs.js';
import applyTac from './handlers/applyTac.js';
import updateTac from './handlers/updateTac.js';
import bookAppointment from './handlers/bookAppointment.js';
import getAnalytics from './handlers/getAnalytics.js';
import getReviews from './handlers/getReviews.js';
import fs from 'fs';

//load env variables
import dotenv from 'dotenv';
dotenv.config();

//initiating express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/static/documents', express.static('uploads')); // serve uploaded file as static file


// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.path}`);
  console.log('Response:', res.statusCode);
  next();
});


// Connect to mongoose
//mongoose.connect('mongodb://127.0.0.1:27017/tacportal')
//mongoose.connect('mongodb+srv://gd03champ:gd03champ@atlas-cluster.prpet6p.mongodb.net/tacportal')
console.log("connecting to: "+process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully! 🍃'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


// Configure Multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // Specify the directory for storing files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original filename
  }
});

const upload = multer({ storage: storage });


//endpoints

app.get('/', (req, res) => {
  res.send('API Healthy ✅');
});

// auth handlers
app.post('/api/login', login);

app.post('/api/register', register);

app.get('/api/protected', requireAuth, (req, res) => { res.json({ message: `token belongs to, ${req.user.email}!` }); });

app.post('/api/logout', requireAuth , logout);

app.post('/api/getUser', requireAuth, getUser);

// handlers
app.post('/api/getTacs', requireAuth, getTacs);

app.post('/api/applyTac', requireAuth, applyTac);

app.post('/api/updateTac', updateTac);

app.post('/api/bookAppointment', requireAuth, bookAppointment);

app.post('/api/getReviews', requireAuth, getReviews);

app.post('/api/getAnalytics', requireAuth, getAnalytics);

// document upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const response = { 
    filename: req.file.filename, 
    //url: `http://localhost:${port}/static/documents/${req.file.filename}` };
    url: `${process.env.HOST_URL}/static/documents/${req.file.filename}` };

  res.json(response);
});

// start the server
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port} 🚀`);
});
