import express from 'express';
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  getCourseMaterials,
  addCourseMaterial,
  getCourseLessons,
  addCourseLesson,
  getFeaturedCourses,
  getCourseCategories,
  searchCourses
} from '../controllers/courseController.js';
import { authenticateToken, optionalAuth } from '../middlewares/auth.js';
import { requireRole, requireCourseOwnership } from '../middlewares/role.js';
import { validate, courseSchemas } from '../middlewares/validate.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/categories', getCourseCategories);
router.get('/search', searchCourses);
router.get('/:id', optionalAuth, getCourse);

// Protected routes
router.post('/', authenticateToken, requireRole('teacher', 'admin'), validate(courseSchemas.create), createCourse);
router.put('/:id', authenticateToken, requireCourseOwnership, validate(courseSchemas.update), updateCourse);
router.delete('/:id', authenticateToken, requireCourseOwnership, deleteCourse);

// Enrollment routes
router.post('/:id/enroll', authenticateToken, requireRole('student'), enrollInCourse);
router.delete('/:id/enroll', authenticateToken, requireRole('student'), unenrollFromCourse);

// Course content routes
router.get('/:id/materials', authenticateToken, getCourseMaterials);
router.post('/:id/materials', authenticateToken, requireCourseOwnership, addCourseMaterial);
router.get('/:id/lessons', authenticateToken, getCourseLessons);
router.post('/:id/lessons', authenticateToken, requireCourseOwnership, addCourseLesson);

export default router; 