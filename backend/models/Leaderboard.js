import mongoose from 'mongoose';

const leaderboardEntrySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  totalScore: {
    type: Number,
    default: 0,
    min: [0, 'Score cannot be negative']
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  averageScore: {
    type: Number,
    default: 0,
    min: [0, 'Average score cannot be negative'],
    max: [100, 'Average score cannot exceed 100']
  },
  completedAssignments: {
    type: Number,
    default: 0
  },
  totalAssignments: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: [0, 'Completion rate cannot be negative'],
    max: [100, 'Completion rate cannot exceed 100']
  },
  learningHours: {
    type: Number,
    default: 0,
    min: [0, 'Learning hours cannot be negative']
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  rank: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  streak: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for unique leaderboard entries
leaderboardEntrySchema.index({ student: 1, course: 1 }, { unique: true });
leaderboardEntrySchema.index({ course: 1, totalScore: -1 });
leaderboardEntrySchema.index({ course: 1, averageScore: -1 });
leaderboardEntrySchema.index({ course: 1, completionRate: -1 });

const leaderboardSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  entries: [leaderboardEntrySchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  totalParticipants: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  topPerformers: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    rank: Number
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
leaderboardSchema.index({ course: 1 });
leaderboardSchema.index({ lastUpdated: -1 });

// Static method to update leaderboard for a course
leaderboardSchema.statics.updateCourseLeaderboard = async function(courseId) {
  const Course = mongoose.model('Course');
  const Assignment = mongoose.model('Assignment');
  const User = mongoose.model('User');

  // Get all students enrolled in the course
  const course = await Course.findById(courseId).populate('enrolledStudents');
  if (!course) {
    throw new Error('Course not found');
  }

  const leaderboard = await this.findOne({ course: courseId }) || new this({ course: courseId });
  const entries = [];

  for (const enrollment of course.enrolledStudents || []) {
    const student = await User.findById(enrollment.student);
    if (!student) continue;

    // Get all assignments for the course
    const assignments = await Assignment.find({ course: courseId, isPublished: true });
    
    let totalScore = 0;
    let totalPoints = 0;
    let completedAssignments = 0;
    let learningHours = student.totalLearningHours || 0;

    // Calculate scores from assignments
    for (const assignment of assignments) {
      const submission = assignment.submissions.find(sub => 
        sub.student.toString() === student._id.toString()
      );
      
      if (submission && submission.score !== undefined) {
        totalScore += submission.score;
        totalPoints += assignment.maxScore;
        completedAssignments++;
      }
    }

    const averageScore = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
    const completionRate = assignments.length > 0 ? (completedAssignments / assignments.length) * 100 : 0;

    entries.push({
      student: student._id,
      course: courseId,
      totalScore,
      totalPoints,
      averageScore: Math.round(averageScore * 100) / 100,
      completedAssignments,
      totalAssignments: assignments.length,
      completionRate: Math.round(completionRate * 100) / 100,
      learningHours,
      lastActivity: student.lastLogin || new Date()
    });
  }

  // Sort by total score and assign ranks
  entries.sort((a, b) => b.totalScore - a.totalScore);
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  leaderboard.entries = entries;
  leaderboard.totalParticipants = entries.length;
  leaderboard.lastUpdated = new Date();
  
  // Calculate overall average score
  if (entries.length > 0) {
    leaderboard.averageScore = entries.reduce((sum, entry) => sum + entry.averageScore, 0) / entries.length;
  }

  // Get top 10 performers
  leaderboard.topPerformers = entries.slice(0, 10).map(entry => ({
    student: entry.student,
    score: entry.totalScore,
    rank: entry.rank
  }));

  return await leaderboard.save();
};

// Static method to get leaderboard for a course
leaderboardSchema.statics.getCourseLeaderboard = async function(courseId, limit = 50) {
  const leaderboard = await this.findOne({ course: courseId })
    .populate('entries.student', 'name email avatar')
    .populate('topPerformers.student', 'name email avatar');

  if (!leaderboard) {
    // Create leaderboard if it doesn't exist
    await this.updateCourseLeaderboard(courseId);
    return await this.findOne({ course: courseId })
      .populate('entries.student', 'name email avatar')
      .populate('topPerformers.student', 'name email avatar');
  }

  return leaderboard;
};

// Static method to get student ranking
leaderboardSchema.statics.getStudentRanking = async function(studentId, courseId) {
  const leaderboard = await this.findOne({ course: courseId });
  if (!leaderboard) return null;

  const entry = leaderboard.entries.find(e => e.student.toString() === studentId.toString());
  return entry ? entry.rank : null;
};

// Method to update individual student entry
leaderboardSchema.methods.updateStudentEntry = async function(studentId, updates) {
  const entryIndex = this.entries.findIndex(e => e.student.toString() === studentId.toString());
  
  if (entryIndex === -1) {
    // Add new entry
    this.entries.push({
      student: studentId,
      course: this.course,
      ...updates
    });
  } else {
    // Update existing entry
    this.entries[entryIndex] = { ...this.entries[entryIndex], ...updates };
  }

  // Recalculate ranks
  this.entries.sort((a, b) => b.totalScore - a.totalScore);
  this.entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  this.lastUpdated = new Date();
  return await this.save();
};

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard; 