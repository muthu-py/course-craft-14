import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: [true, 'Attendance date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    required: [true, 'Attendance status is required']
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Marked by is required']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  session: {
    type: String,
    required: [true, 'Session identifier is required']
  }
}, {
  timestamps: true
});

// Compound index for unique attendance records
attendanceSchema.index({ course: 1, student: 1, date: 1, session: 1 }, { unique: true });
attendanceSchema.index({ course: 1, date: 1 });
attendanceSchema.index({ student: 1, date: 1 });

// Static method to mark attendance for multiple students
attendanceSchema.statics.markAttendance = async function(attendanceData) {
  const attendanceRecords = attendanceData.map(record => ({
    course: record.course,
    student: record.student,
    date: record.date,
    status: record.status,
    markedBy: record.markedBy,
    notes: record.notes,
    session: record.session
  }));

  return await this.insertMany(attendanceRecords, { ordered: false });
};

// Static method to get attendance report for a course
attendanceSchema.statics.getCourseAttendance = async function(courseId, startDate, endDate) {
  return await this.find({
    course: courseId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('student', 'name email').populate('markedBy', 'name');
};

// Static method to get student attendance
attendanceSchema.statics.getStudentAttendance = async function(studentId, courseId = null) {
  const query = { student: studentId };
  if (courseId) {
    query.course = courseId;
  }

  return await this.find(query)
    .populate('course', 'title')
    .populate('markedBy', 'name')
    .sort({ date: -1 });
};

// Static method to calculate attendance percentage
attendanceSchema.statics.calculateAttendancePercentage = async function(studentId, courseId, startDate, endDate) {
  const attendance = await this.find({
    student: studentId,
    course: courseId,
    date: { $gte: startDate, $lte: endDate }
  });

  if (attendance.length === 0) return 0;

  const presentCount = attendance.filter(record => 
    record.status === 'present' || record.status === 'late'
  ).length;

  return Math.round((presentCount / attendance.length) * 100);
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance; 