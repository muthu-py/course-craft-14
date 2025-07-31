import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required']
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'],
    required: [true, 'Question type is required']
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: function() {
      return this.type === 'multiple_choice' || this.type === 'true_false';
    }
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: [1, 'Points must be at least 1']
  }
});

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  content: {
    type: String,
    required: [true, 'Submission content is required']
  },
  fileUrl: {
    type: String,
    default: null
  },
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  feedback: {
    type: String,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  gradedAt: {
    type: Date,
    default: null
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isLate: {
    type: Boolean,
    default: false
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer: String,
    score: Number
  }]
}, {
  timestamps: true
});

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  maxScore: {
    type: Number,
    required: [true, 'Maximum score is required'],
    min: [1, 'Maximum score must be at least 1']
  },
  submissionType: {
    type: String,
    enum: ['file', 'text', 'link', 'quiz'],
    required: [true, 'Submission type is required']
  },
  questions: [questionSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  latePenalty: {
    type: Number,
    default: 0,
    min: [0, 'Late penalty cannot be negative'],
    max: [100, 'Late penalty cannot exceed 100']
  },
  submissions: [submissionSchema],
  // Analytics
  totalSubmissions: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
assignmentSchema.index({ course: 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ isPublished: 1 });
assignmentSchema.index({ 'submissions.student': 1 });

// Pre-save middleware to update analytics
assignmentSchema.pre('save', function(next) {
  if (this.submissions && this.submissions.length > 0) {
    this.totalSubmissions = this.submissions.length;
    const totalScore = this.submissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
    this.averageScore = totalScore / this.submissions.length;
  }
  next();
});

// Method to submit assignment
assignmentSchema.methods.submitAssignment = function(studentId, content, fileUrl = null) {
  const submission = {
    student: studentId,
    content,
    fileUrl,
    submittedAt: new Date(),
    isLate: new Date() > this.dueDate
  };

  // Check if student already submitted
  const existingSubmission = this.submissions.find(sub => sub.student.toString() === studentId.toString());
  if (existingSubmission) {
    throw new Error('Student has already submitted this assignment');
  }

  this.submissions.push(submission);
  return this.save();
};

// Method to grade submission
assignmentSchema.methods.gradeSubmission = function(submissionId, score, feedback, gradedBy) {
  const submission = this.submissions.id(submissionId);
  if (!submission) {
    throw new Error('Submission not found');
  }

  submission.score = score;
  submission.feedback = feedback;
  submission.gradedAt = new Date();
  submission.gradedBy = gradedBy;

  return this.save();
};

// Method to get student submission
assignmentSchema.methods.getStudentSubmission = function(studentId) {
  return this.submissions.find(sub => sub.student.toString() === studentId.toString());
};

// Method to calculate late penalty
assignmentSchema.methods.calculateLatePenalty = function(submittedAt) {
  if (!this.allowLateSubmission || submittedAt <= this.dueDate) {
    return 0;
  }
  return this.latePenalty;
};

// Virtual for assignment status
assignmentSchema.virtual('status').get(function() {
  const now = new Date();
  if (now < this.dueDate) {
    return 'active';
  } else if (this.allowLateSubmission) {
    return 'late';
  } else {
    return 'closed';
  }
});

// Virtual for days until due
assignmentSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const diffTime = this.dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtual fields are serialized
assignmentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment; 