import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Import database connection
import connectDB from './config/db.js';

// Import middleware
import { errorHandler, notFound } from './middlewares/error.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CourseCraft API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/teacher', teacherRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);

// API documentation endpoint
app.get('/api/v1/docs', (req, res) => {
  res.json({
    success: true,
    message: 'CourseCraft API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/v1/auth/register': 'Register a new user',
        'POST /api/v1/auth/login': 'Login user',
        'GET /api/v1/auth/me': 'Get current user',
        'PUT /api/v1/auth/profile': 'Update user profile',
        'POST /api/v1/auth/logout': 'Logout user'
      },
      courses: {
        'GET /api/v1/courses': 'Get all courses',
        'GET /api/v1/courses/:id': 'Get single course',
        'POST /api/v1/courses': 'Create course (Teacher/Admin)',
        'PUT /api/v1/courses/:id': 'Update course (Owner/Admin)',
        'DELETE /api/v1/courses/:id': 'Delete course (Owner/Admin)',
        'POST /api/v1/courses/:id/enroll': 'Enroll in course (Student)',
        'DELETE /api/v1/courses/:id/enroll': 'Unenroll from course (Student)'
      },
      teacher: {
        'GET /api/v1/teacher/courses': 'Get teacher courses',
        'GET /api/v1/teacher/assignments': 'Get teacher assignments',
        'POST /api/v1/teacher/assignments': 'Create assignment',
        'GET /api/v1/teacher/attendance': 'Get attendance records',
        'POST /api/v1/teacher/attendance': 'Mark attendance',
        'GET /api/v1/teacher/feedback': 'Get feedback',
        'POST /api/v1/teacher/placements': 'Create placement'
      },
      student: {
        'GET /api/v1/student/courses': 'Get enrolled courses',
        'GET /api/v1/student/assignments': 'Get assignments',
        'POST /api/v1/student/assignments/:id/submit': 'Submit assignment',
        'GET /api/v1/student/attendance': 'Get attendance',
        'GET /api/v1/student/leaderboard': 'Get leaderboard',
        'POST /api/v1/student/feedback': 'Submit feedback',
        'GET /api/v1/student/placements': 'Get placements'
      },
      admin: {
        'GET /api/v1/admin/users': 'Get all users',
        'PUT /api/v1/admin/users/:id': 'Update user',
        'GET /api/v1/admin/analytics': 'Get analytics',
        'GET /api/v1/admin/courses': 'Get all courses (Admin)',
        'GET /api/v1/admin/feedback': 'Get all feedback'
      },
      upload: {
        'POST /api/v1/upload/file': 'Upload file to cloud storage',
        'GET /api/v1/upload/signature': 'Get upload signature'
      }
    }
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 CourseCraft API running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API docs: http://localhost:${PORT}/api/v1/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app; 