import React from 'react';
import { Layout } from '@/components/Layout/Layout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { CourseCard } from '@/components/Course/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp, 
  PlusCircle,
  Calendar,
  MessageSquare,
  FileText,
  Video,
  Award
} from 'lucide-react';
import { mockCourses } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const TeacherDashboard: React.FC = () => {
  // Mock data for teacher's courses
  const myCourses = mockCourses.slice(0, 3);
  const totalStudents = myCourses.reduce((sum, course) => sum + course.enrolled_count, 0);
  const averageRating = myCourses.reduce((sum, course) => sum + course.rating, 0) / myCourses.length;
  
  const enrollmentData = [
    { month: 'Jan', students: 45 },
    { month: 'Feb', students: 62 },
    { month: 'Mar', students: 78 },
    { month: 'Apr', students: 95 },
    { month: 'May', students: 123 },
    { month: 'Jun', students: 156 },
  ];

  const recentActivities = [
    { id: 1, type: 'enrollment', message: 'New student enrolled in React Bootcamp', time: '2 hours ago' },
    { id: 2, type: 'question', message: 'Question posted in Python course forum', time: '4 hours ago' },
    { id: 3, type: 'assignment', message: 'Assignment submitted in ML course', time: '6 hours ago' },
    { id: 4, type: 'review', message: 'New 5-star review on React course', time: '1 day ago' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-teacher-accent to-success text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                <p className="text-white/80 mt-2">
                  Create, manage, and track your courses
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" size="lg">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Course
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="My Courses"
              value={myCourses.length}
              description="Published courses"
              icon={BookOpen}
              trend={{ value: 0, isPositive: true }}
              variant="success"
            />
            <StatsCard
              title="Total Students"
              value={totalStudents.toLocaleString()}
              description="Across all courses"
              icon={Users}
              trend={{ value: 18.2, isPositive: true }}
              variant="primary"
            />
            <StatsCard
              title="Average Rating"
              value={averageRating.toFixed(1)}
              description="Course ratings"
              icon={Star}
              trend={{ value: 0.3, isPositive: true }}
              variant="warning"
            />
            <StatsCard
              title="Monthly Earnings"
              value="$3,240"
              description="This month"
              icon={TrendingUp}
              trend={{ value: 12.5, isPositive: true }}
              variant="destructive"
            />
          </div>

          {/* Charts and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Enrollment Trend */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Student Enrollment Trend</CardTitle>
                <CardDescription>Monthly enrollment growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="students" 
                      stroke="hsl(var(--teacher-accent))" 
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates from your courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                    <div className="w-8 h-8 bg-teacher-accent/10 rounded-full flex items-center justify-center">
                      {activity.type === 'enrollment' && <Users className="h-4 w-4 text-teacher-accent" />}
                      {activity.type === 'question' && <MessageSquare className="h-4 w-4 text-teacher-accent" />}
                      {activity.type === 'assignment' && <FileText className="h-4 w-4 text-teacher-accent" />}
                      {activity.type === 'review' && <Star className="h-4 w-4 text-teacher-accent" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* My Courses */}
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Manage your published courses</CardDescription>
              </div>
              <Button variant="teacher">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Course
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    actionButton="manage"
                    showPrice={false}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>Detailed metrics for each course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {myCourses.map((course) => (
                  <div key={course.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium line-clamp-1">{course.title}</h4>
                      <Badge variant="outline">{course.enrolled_count} students</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-medium">{course.rating}</div>
                        <div className="text-muted-foreground">Rating</div>
                      </div>
                      <div>
                        <div className="font-medium">{course.total_lessons}</div>
                        <div className="text-muted-foreground">Lessons</div>
                      </div>
                      <div>
                        <div className="font-medium">89%</div>
                        <div className="text-muted-foreground">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common teaching tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Video className="h-6 w-6 mb-2" />
                    Record Lesson
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Create Assignment
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    Answer Questions
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Award className="h-6 w-6 mb-2" />
                    Grade Submissions
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
                  <h4 className="font-medium text-success mb-2">Teaching Tips</h4>
                  <p className="text-sm text-muted-foreground">
                    Engage with your students regularly and provide timely feedback to improve course satisfaction rates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;