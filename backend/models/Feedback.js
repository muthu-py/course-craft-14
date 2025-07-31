import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required']
  },
  type: {
    type: String,
    enum: ['general', 'technical', 'content', 'teaching', 'other'],
    required: [true, 'Feedback type is required']
  },
  title: {
    type: String,
    required: [true, 'Feedback title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Feedback content is required'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    required: [true, 'Rating is required']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'resolved', 'closed'],
    default: 'pending'
  },
  response: {
    content: {
      type: String,
      maxlength: [2000, 'Response cannot exceed 2000 characters']
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: {
      type: Date,
      default: null
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
feedbackSchema.index({ course: 1 });
feedbackSchema.index({ student: 1 });
feedbackSchema.index({ teacher: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ type: 1 });
feedbackSchema.index({ rating: -1 });
feedbackSchema.index({ createdAt: -1 });

// Static method to get feedback for a course
feedbackSchema.statics.getCourseFeedback = async function(courseId, options = {}) {
  const query = { course: courseId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.type) {
    query.type = options.type;
  }

  return await this.find(query)
    .populate('student', 'name email')
    .populate('teacher', 'name email')
    .populate('response.respondedBy', 'name')
    .sort({ createdAt: -1 });
};

// Static method to get teacher feedback
feedbackSchema.statics.getTeacherFeedback = async function(teacherId, options = {}) {
  const query = { teacher: teacherId };
  
  if (options.status) {
    query.status = options.status;
  }

  return await this.find(query)
    .populate('course', 'title')
    .populate('student', 'name email')
    .populate('response.respondedBy', 'name')
    .sort({ createdAt: -1 });
};

// Static method to get student feedback
feedbackSchema.statics.getStudentFeedback = async function(studentId) {
  return await this.find({ student: studentId })
    .populate('course', 'title')
    .populate('teacher', 'name email')
    .populate('response.respondedBy', 'name')
    .sort({ createdAt: -1 });
};

// Method to respond to feedback
feedbackSchema.methods.respondToFeedback = function(responseContent, respondedBy) {
  this.response = {
    content: responseContent,
    respondedBy,
    respondedAt: new Date()
  };
  this.status = 'acknowledged';
  return this.save();
};

// Method to update status
feedbackSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

// Virtual for average rating
feedbackSchema.virtual('isResolved').get(function() {
  return this.status === 'resolved' || this.status === 'closed';
});

// Ensure virtual fields are serialized
feedbackSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback; 