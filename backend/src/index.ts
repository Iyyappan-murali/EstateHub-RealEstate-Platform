import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { ENV } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimiter.middleware';

import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import inquiryRoutes from './routes/inquiry.routes';

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for property uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger / OpenAPI documentation endpoint (Mandatory Requirement)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// General API rate limiter
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Global Error Handler
app.use(errorHandler);

const server = app.listen(ENV.PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Real Estate Platform API running on port ${ENV.PORT}`);
  console.log(`📖 Swagger API Documentation: http://localhost:${ENV.PORT}/api-docs`);
  console.log(`🩺 Health Check: http://localhost:${ENV.PORT}/health`);
  console.log(`=======================================================`);
});

export default app;
