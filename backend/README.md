# CourseCraft Backend API

A comprehensive MongoDB-based backend API for the CourseCraft LMS platform, built with Node.js, Express, and Mongoose.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Course Management**: Full CRUD operations for courses, lessons, and materials
- **Assignment System**: Create, submit, and grade assignments with file uploads
- **Attendance Tracking**: Mark and track student attendance
- **Feedback System**: Student feedback and teacher responses
- **Leaderboard**: Student performance tracking and rankings
- **Placement Opportunities**: Job placement posting and applications
- **File Upload**: Cloudinary integration for file storage
- **Analytics**: Comprehensive analytics for admin dashboard
- **Real-time Features**: WebSocket support for real-time updates

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for file uploads)
- npm or yarn

## 🛠 Installation

1. **Clone the repository**
   ```bash
   cd course-craft-14/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/coursecraft
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000,http://localhost:8080
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| GET | `/api/v1/auth/me` | Get current user | Private |
| PUT | `/api/v1/auth/profile` | Update profile | Private |
| POST | `/api/v1/auth/logout` | Logout user | Private |

### Course Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/courses` | Get all courses | Public |
| GET | `/api/v1/courses/:id` | Get single course | Public |
| POST | `/api/v1/courses` | Create course | Teacher/Admin |
| PUT | `/api/v1/courses/:id` | Update course | Owner/Admin |
| DELETE | `/api/v1/courses/:id` | Delete course | Owner/Admin |
| POST | `/api/v1/courses/:id/enroll` | Enroll in course | Student |
| DELETE | `/api/v1/courses/:id/enroll` | Unenroll from course | Student |

### Teacher Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/teacher/courses` | Get teacher courses | Teacher |
| POST | `/api/v1/teacher/assignments` | Create assignment | Teacher |
| POST | `/api/v1/teacher/attendance` | Mark attendance | Teacher |
| GET | `/api/v1/teacher/feedback` | Get feedback | Teacher |
| POST | `/api/v1/teacher/placements` | Create placement | Teacher |

### Student Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/student/courses` | Get enrolled courses | Student |
| GET | `/api/v1/student/assignments` | Get assignments | Student |
| POST | `/api/v1/student/assignments/:id/submit` | Submit assignment | Student |
| GET | `/api/v1/student/attendance` | Get attendance | Student |
| GET | `/api/v1/student/leaderboard` | Get leaderboard | Student |
| POST | `/api/v1/student/feedback` | Submit feedback | Student |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/admin/users` | Get all users | Admin |
| PUT | `/api/v1/admin/users/:id` | Update user | Admin |
| GET | `/api/v1/admin/analytics` | Get analytics | Admin |
| GET | `/api/v1/admin/courses` | Get all courses | Admin |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access Control

- **Admin**: Full access to all features
- **Teacher**: Can create/manage courses, assignments, attendance, feedback
- **Student**: Can enroll in courses, submit assignments, view materials

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js          # MongoDB connection
│   └── cloud.js       # Cloudinary configuration
├── controllers/
│   ├── authController.js
│   ├── courseController.js
│   ├── teacherController.js
│   ├── studentController.js
│   └── adminController.js
├── middlewares/
│   ├── auth.js        # JWT authentication
│   ├── role.js        # Role-based access control
│   ├── validate.js    # Request validation
│   └── error.js       # Error handling
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Assignment.js
│   ├── Attendance.js
│   ├── Feedback.js
│   ├── Leaderboard.js
│   └── Placement.js
├── routes/
│   ├── auth.routes.js
│   ├── course.routes.js
│   ├── teacher.routes.js
│   ├── student.routes.js
│   └── admin.routes.js
├── services/
│   ├── authService.js
│   ├── fileUploadService.js
│   └── analyticsService.js
├── utils/
│   ├── token.js
│   └── logger.js
├── index.js           # Main server file
├── package.json
└── README.md
```

## 🗄 Database Schema

### User Model
- Basic info (name, email, password)
- Role-based access (admin, teacher, student)
- Enrolled courses and progress tracking
- Analytics (learning hours, certificates, scores)

### Course Model
- Course details (title, description, price, duration)
- Lessons and materials
- Enrollment tracking
- Analytics (views, completion rate)

### Assignment Model
- Assignment details with questions
- Student submissions and grading
- File upload support
- Analytics (completion rate, average scores)

### Attendance Model
- Course and student tracking
- Multiple status types (present, absent, late, excused)
- Session-based attendance marking

### Feedback Model
- Student feedback with ratings
- Teacher responses
- Anonymous feedback support
- Status tracking (pending, acknowledged, resolved)

### Leaderboard Model
- Student performance tracking
- Course-based rankings
- Achievement system
- Analytics aggregation

### Placement Model
- Job opportunity posting
- Application tracking
- Resume and cover letter uploads
- Status management

## 🚀 Deployment

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coursecraft

# JWT
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🔧 Development

### Adding New Features

1. Create the model in `models/`
2. Create the controller in `controllers/`
3. Create the routes in `routes/`
4. Add validation schemas in `middlewares/validate.js`
5. Update API documentation

### Code Style

- Use ES6+ features
- Follow async/await pattern
- Implement proper error handling
- Add JSDoc comments for functions
- Use meaningful variable names

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/v1/docs`
- Review the health check at `/health`

## 🔗 Links

- [Frontend Repository](https://github.com/muthu-py/course-craft-14)
- [Live Demo](https://course-craft-14.lovable.app)
- [API Documentation](http://localhost:5000/api/v1/docs) 