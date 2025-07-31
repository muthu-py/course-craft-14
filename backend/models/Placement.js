import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Placement title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Placement description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
    required: [true, 'Employment type is required']
  },
  salary: {
    min: {
      type: Number,
      required: [true, 'Minimum salary is required']
    },
    max: {
      type: Number,
      required: [true, 'Maximum salary is required']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Posted by is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Related course is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  applications: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending'
    },
    resume: {
      type: String,
      required: true
    },
    coverLetter: {
      type: String,
      maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  }],
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'lead'],
    required: [true, 'Experience level is required']
  },
  benefits: [{
    type: String,
    trim: true
  }],
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactPhone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
placementSchema.index({ course: 1 });
placementSchema.index({ postedBy: 1 });
placementSchema.index({ isActive: 1 });
placementSchema.index({ type: 1 });
placementSchema.index({ location: 1 });
placementSchema.index({ experience: 1 });
placementSchema.index({ applicationDeadline: 1 });
placementSchema.index({ 'applications.student': 1 });
placementSchema.index({ createdAt: -1 });

// Pre-save middleware to update applications count
placementSchema.pre('save', function(next) {
  this.applicationsCount = this.applications.length;
  next();
});

// Static method to get placements for a course
placementSchema.statics.getCoursePlacements = async function(courseId, options = {}) {
  const query = { course: courseId, isActive: true };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.experience) {
    query.experience = options.experience;
  }

  return await this.find(query)
    .populate('postedBy', 'name email')
    .populate('course', 'title')
    .sort({ createdAt: -1 });
};

// Static method to get teacher's placements
placementSchema.statics.getTeacherPlacements = async function(teacherId) {
  return await this.find({ postedBy: teacherId })
    .populate('course', 'title')
    .populate('applications.student', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to get student's applications
placementSchema.statics.getStudentApplications = async function(studentId) {
  return await this.find({
    'applications.student': studentId
  })
    .populate('course', 'title')
    .populate('postedBy', 'name email')
    .sort({ createdAt: -1 });
};

// Method to apply for placement
placementSchema.methods.applyForPlacement = function(studentId, resume, coverLetter = '') {
  // Check if student already applied
  const existingApplication = this.applications.find(app => 
    app.student.toString() === studentId.toString()
  );
  
  if (existingApplication) {
    throw new Error('Student has already applied for this placement');
  }

  // Check if application deadline has passed
  if (new Date() > this.applicationDeadline) {
    throw new Error('Application deadline has passed');
  }

  this.applications.push({
    student: studentId,
    resume,
    coverLetter,
    appliedAt: new Date()
  });

  return this.save();
};

// Method to review application
placementSchema.methods.reviewApplication = function(applicationId, status, notes = '', reviewedBy) {
  const application = this.applications.id(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }

  application.status = status;
  application.notes = notes;
  application.reviewedBy = reviewedBy;
  application.reviewedAt = new Date();

  return this.save();
};

// Method to update placement status
placementSchema.methods.updateStatus = function(isActive) {
  this.isActive = isActive;
  return this.save();
};

// Virtual for formatted salary range
placementSchema.virtual('formattedSalary').get(function() {
  return `${this.salary.currency} ${this.salary.min.toLocaleString()} - ${this.salary.max.toLocaleString()}`;
});

// Virtual for days until deadline
placementSchema.virtual('daysUntilDeadline').get(function() {
  const now = new Date();
  const diffTime = this.applicationDeadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for application status
placementSchema.virtual('isExpired').get(function() {
  return new Date() > this.applicationDeadline;
});

// Ensure virtual fields are serialized
placementSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

const Placement = mongoose.model('Placement', placementSchema);

export default Placement; 