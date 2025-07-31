import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required']
  },
  videoUrl: {
    type: String,
    default: null
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Lesson duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  order: {
    type: Number,
    required: [true, 'Lesson order is required'],
    min: [1, 'Order must be at least 1']
  },
  isFree: {
    type: Boolean,
    default: false
  },
  materials: [{
    title: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }]
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Course duration is required']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Course level is required']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    trim: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  lessons: [lessonSchema],
  materials: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    fileUrl: {
      type: String,
      required: true
    },
    fileType: String,
    fileSize: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  // Analytics
  totalViews: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  averageCompletionTime: {
    type: Number, // in days
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ enrolledCount: -1 });

// Pre-save middleware to update total lessons
courseSchema.pre('save', function(next) {
  this.totalLessons = this.lessons.length;
  next();
});

// Method to calculate average rating
courseSchema.methods.calculateAverageRating = function() {
  // This would be implemented when we add reviews/ratings
  return this.rating;
};

// Method to enroll a student
courseSchema.methods.enrollStudent = function(studentId) {
  // This would be implemented in the enrollment logic
  this.enrolledCount += 1;
  return this.save();
};

// Method to get course progress for a student
courseSchema.methods.getStudentProgress = function(studentId) {
  // This would be implemented to track individual student progress
  return 0; // Placeholder
};

// Virtual for formatted price
courseSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for total duration in hours
courseSchema.virtual('totalDurationHours').get(function() {
  const totalMinutes = this.lessons.reduce((total, lesson) => total + lesson.duration, 0);
  return Math.round(totalMinutes / 60 * 10) / 10;
});

// Ensure virtual fields are serialized
courseSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

const Course = mongoose.model('Course', courseSchema);

export default Course; 