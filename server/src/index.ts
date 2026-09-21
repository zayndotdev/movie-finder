import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

import moviesRouter from './routes/movies';
import tvRouter from './routes/tv';
import discoverRouter from './routes/discover';
import searchRouter from './routes/search';
import aiRouter from './routes/ai';
import personRouter from './routes/person';
import metadataRouter from './routes/metadata';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.url.includes('/health')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api/movies', moviesRouter);
app.use('/api/tv', tvRouter);
app.use('/api/discover', discoverRouter);
app.use('/api/search', searchRouter);
app.use('/api/ai', aiRouter);
app.use('/api/person', personRouter);
app.use('/api', metadataRouter);

// Global Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🎬 CineMatch Server running on http://localhost:${PORT}`);
  console.log(`   - TMDB Status: ${process.env.TMDB_API_KEY ? 'Live API Configured' : 'High-Fidelity Mock & Demo Fallback'}`);
  console.log(`   - Gemini AI: ${process.env.GEMINI_API_KEY ? 'Active' : 'Fallback to Groq / Rule-based engine'}`);
});

export { app, server };
