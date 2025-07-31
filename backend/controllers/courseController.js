import Course from '../models/Course.js';
import User from '../models/User.js';
import { AppError } from '../middlewares/error.js';
import { asyncHandler } from '../middlewares/error.js';

// @desc    Get all courses
// @route   GET /api/v1/courses
// @access  Public
export const getAllCourses = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    level,
    search,
    sort = 'createdAt',
    order = 'desc',
    isPublished = true
  } = req.query;

  // Build query
  const query = { isPublished };
  
  if (category) {
    query.category = category;
  }
  
  if (level) {
    query.level = level;
  }
  
  if (search) {
    query.$text = { $search: search };
  }

  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;

  // Execute query
  const courses = await Course.find(query)
    .populate('instructor', 'name email avatar')
    .sort(sortObj)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  // Get total count
  const total = await Course.countDocuments(query);

  res.json({
    success: true,
    data: {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name email avatar bio')
    .populate('materials.uploadedBy', 'name');

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Increment view count
  course.totalViews += 1;
  await course.save();

  res.json({
    success: true,
    data: {
      course
    }
  });
});

// @desc    Create course
// @route   POST /api/v1/courses
// @access  Private (Teacher/Admin)
export const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    duration,
    level,
    category,
    tags,
    requirements,
    learningOutcomes
  } = req.body;

  const course = await Course.create({
    title,
    description,
    instructor: req.user._id,
    price,
    duration,
    level,
    category,
    tags,
    requirements,
    learningOutcomes
  });

  // Add course to teacher's created courses
  await User.findByIdAndUpdate(req.user._id, {
    $push: { createdCourses: course._id }
  });

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: {
      course
    }
  });
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private (Course Owner/Admin)
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Check ownership
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this course', 403);
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('instructor', 'name email avatar');

  res.json({
    success: true,
    message: 'Course updated successfully',
    data: {
      course: updatedCourse
    }
  });
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private (Course Owner/Admin)
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Check ownership
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this course', 403);
  }

  await Course.findByIdAndDelete(req.params.id);

  // Remove course from teacher's created courses
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { createdCourses: course._id }
  });

  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
});

// @desc    Enroll in course
// @route   POST /api/v1/courses/:id/enroll
// @access  Private (Student)
export const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (!course.isPublished) {
    throw new AppError('Course is not published', 400);
  }

  const user = await User.findById(req.user._id);

  // Check if already enrolled
  const isEnrolled = user.enrolledCourses.some(
    enrollment => enrollment.course.toString() === course._id.toString()
  );

  if (isEnrolled) {
    throw new AppError('Already enrolled in this course', 400);
  }

  // Add to enrolled courses
  user.enrolledCourses.push({
    course: course._id,
    enrolledAt: new Date()
  });

  await user.save();

  // Increment course enrollment count
  course.enrolledCount += 1;
  await course.save();

  res.json({
    success: true,
    message: 'Successfully enrolled in course',
    data: {
      course: {
        id: course._id,
        title: course.title,
        instructor: course.instructor
      }
    }
  });
});

// @desc    Unenroll from course
// @route   DELETE /api/v1/courses/:id/enroll
// @access  Private (Student)
export const unenrollFromCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const user = await User.findById(req.user._id);

  // Check if enrolled
  const enrollmentIndex = user.enrolledCourses.findIndex(
    enrollment => enrollment.course.toString() === course._id.toString()
  );

  if (enrollmentIndex === -1) {
    throw new AppError('Not enrolled in this course', 400);
  }

  // Remove from enrolled courses
  user.enrolledCourses.splice(enrollmentIndex, 1);
  await user.save();

  // Decrement course enrollment count
  course.enrolledCount = Math.max(0, course.enrolledCount - 1);
  await course.save();

  res.json({
    success: true,
    message: 'Successfully unenrolled from course'
  });
});

// @desc    Get course materials
// @route   GET /api/v1/courses/:id/materials
// @access  Private (Enrolled Students/Teacher/Admin)
export const getCourseMaterials = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('materials.uploadedBy', 'name email');

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.json({
    success: true,
    data: {
      materials: course.materials
    }
  });
});

// @desc    Add course material
// @route   POST /api/v1/courses/:id/materials
// @access  Private (Course Owner/Admin)
export const addCourseMaterial = asyncHandler(async (req, res) => {
  const { title, description, fileUrl, fileType, fileSize } = req.body;

  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Check ownership
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to add materials to this course', 403);
  }

  course.materials.push({
    title,
    description,
    fileUrl,
    fileType,
    fileSize,
    uploadedBy: req.user._id
  });

  await course.save();

  res.status(201).json({
    success: true,
    message: 'Material added successfully',
    data: {
      material: course.materials[course.materials.length - 1]
    }
  });
});

// @desc    Get course lessons
// @route   GET /api/v1/courses/:id/lessons
// @access  Private (Enrolled Students/Teacher/Admin)
export const getCourseLessons = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.json({
    success: true,
    data: {
      lessons: course.lessons.sort((a, b) => a.order - b.order)
    }
  });
});

// @desc    Add course lesson
// @route   POST /api/v1/courses/:id/lessons
// @access  Private (Course Owner/Admin)
export const addCourseLesson = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    content,
    videoUrl,
    duration,
    order,
    isFree
  } = req.body;

  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Check ownership
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to add lessons to this course', 403);
  }

  course.lessons.push({
    title,
    description,
    content,
    videoUrl,
    duration,
    order,
    isFree
  });

  await course.save();

  res.status(201).json({
    success: true,
    message: 'Lesson added successfully',
    data: {
      lesson: course.lessons[course.lessons.length - 1]
    }
  });
});

// @desc    Get featured courses
// @route   GET /api/v1/courses/featured
// @access  Public
export const getFeaturedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isFeatured: true, isPublished: true })
    .populate('instructor', 'name email avatar')
    .limit(6)
    .sort({ rating: -1 });

  res.json({
    success: true,
    data: {
      courses
    }
  });
});

// @desc    Get course categories
// @route   GET /api/v1/courses/categories
// @access  Public
export const getCourseCategories = asyncHandler(async (req, res) => {
  const categories = await Course.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: {
      categories
    }
  });
});

// @desc    Search courses
// @route   GET /api/v1/courses/search
// @access  Public
export const searchCourses = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    throw new AppError('Search query is required', 400);
  }

  const courses = await Course.find({
    $text: { $search: q },
    isPublished: true
  })
    .populate('instructor', 'name email avatar')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ score: { $meta: 'textScore' } });

  const total = await Course.countDocuments({
    $text: { $search: q },
    isPublished: true
  });

  res.json({
    success: true,
    data: {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}); 