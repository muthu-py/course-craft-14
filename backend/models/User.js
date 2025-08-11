import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // Student specific fields
  enrolledCourses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  // Teacher specific fields
  createdCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  // Analytics
  totalLearningHours: {
    type: Number,
    default: 0
  },
  certificatesEarned: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'enrolledCourses.course': 1 });

// No password hashing (store and compare as plain text for this environment)

// Method to compare password (plain text)
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('=== comparePassword DEBUG ===');
  console.log('Candidate password:', candidatePassword);
  console.log('Stored password:', this.password);
  console.log('Candidate password type:', typeof candidatePassword);
  console.log('Stored password type:', typeof this.password);
  console.log('Direct comparison (==):', candidatePassword == this.password);
  console.log('Strict comparison (===):', candidatePassword === this.password);
  
  return candidatePassword == this.password;
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  console.log('=== findByEmail DEBUG ===');
  console.log('Searching for email:', email);
  console.log('Email to lowercase:', email ? email.toLowerCase() : 'N/A');
  console.log('Email type:', typeof email);
  
  const query = { email: email.toLowerCase() };
  console.log('MongoDB query:', JSON.stringify(query));
  
  return this.findOne(query);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User; 