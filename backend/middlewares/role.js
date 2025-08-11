import mongoose from 'mongoose';
import User from '../models/User.js';
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

export const requireAdmin = (req, res, next) => {
  return requireRole('admin')(req, res, next);
};

export const requireTeacher = (req, res, next) => {
  return requireRole('teacher', 'admin')(req, res, next);
};

export const requireStudent = (req, res, next) => {
  return requireRole('student', 'teacher', 'admin')(req, res, next);
};

export const requireTeacherOrAdmin = (req, res, next) => {
  return requireRole('teacher', 'admin')(req, res, next);
};

export const requireStudentOrTeacher = (req, res, next) => {
  return requireRole('student', 'teacher', 'admin')(req, res, next);
};

// Middleware to check if user owns the resource
export const requireOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Admin can access all resources
      if (req.user.role === 'admin') {
        req.resource = resource;
        return next();
      }

      // Check ownership based on resource type
      let isOwner = false;

      if (resource.instructor && resource.instructor.toString() === req.user._id.toString()) {
        isOwner = true;
      } else if (resource.postedBy && resource.postedBy.toString() === req.user._id.toString()) {
        isOwner = true;
      } else if (resource.teacher && resource.teacher.toString() === req.user._id.toString()) {
        isOwner = true;
      } else if (resource.student && resource.student.toString() === req.user._id.toString()) {
        isOwner = true;
      }

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not own this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking resource ownership'
      });
    }
  };
};

// Middleware to check course enrollment
export const requireCourseEnrollment = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    const userId = req.user._id;

    // Admin and teachers can access all courses
    if (req.user.role === 'admin' || req.user.role === 'teacher') {
      return next();
    }

    // Check if student is enrolled in the course
    const user = await User.findById(userId).populate('enrolledCourses.course');
    const isEnrolled = user.enrolledCourses.some(enrollment => 
      enrollment.course._id.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access this resource'
      });
    }

    next();
  } catch (error) {
    console.error('Course enrollment check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking course enrollment'
    });
  }
};

// Middleware to check course ownership (for teachers)
export const requireCourseOwnership = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    const userId = req.user._id;

    // Admin can access all courses
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if teacher owns the course
    const Course = mongoose.model('Course');
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this course'
      });
    }

    req.course = course;
    next();
  } catch (error) {
    console.error('Course ownership check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking course ownership'
    });
  }
}; 