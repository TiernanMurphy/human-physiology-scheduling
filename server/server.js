import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load .env fom parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// middleware to parse JSON
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch(err => console.error('✗ MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);

// serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// serve data files with correct MIME type
app.use('/data', express.static(path.join(__dirname, '../data'), {
    setHeaders: (res, filepath) => {
        if (filepath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/home.html'));
});

// register page route
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/register.html'));
});

app.listen(PORT, () => {
    console.log(`ASPN server running at http://localhost:${PORT}`);
});