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
  Award, 
  Clock, 
  TrendingUp, 
  Target,
  Calendar,
  PlayCircle,
  CheckCircle,
  Star,
  Trophy
} from 'lucide-react';
import { mockCourses, getEnrolledCourses, getRecommendedCourses } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const StudentDashboard: React.FC = () => {
  const enrolledCourses = getEnrolledCourses('student1');
  const recommendedCourses = getRecommendedCourses('student1');
  
  const progressData = [
    { week: 'Week 1', progress: 100 },
    { week: 'Week 2', progress: 85 },
    { week: 'Week 3', progress: 75 },
    { week: 'Week 4', progress: 60 },
    { week: 'Week 5', progress: 45 },
    { week: 'Week 6', progress: 30 },
  ];

  const achievements = [
    { title: 'First Course Completed', description: 'Completed your first course', earned: true },
    { title: 'Quick Learner', description: 'Completed 3 lessons in one day', earned: true },
    { title: 'Consistent Student', description: '7 day learning streak', earned: false },
    { title: 'Top Performer', description: 'Scored 95% or higher on 3 quizzes', earned: false },
  ];

  const upcomingDeadlines = [
    { course: 'React Development', task: 'Final Project', due: '2 days', type: 'assignment' },
    { course: 'Python for Data Science', task: 'Quiz 3', due: '5 days', type: 'quiz' },
    { course: 'UI/UX Design', task: 'Portfolio Review', due: '1 week', type: 'assignment' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-student-accent to-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
                <p className="text-white/80 mt-2">
                  Continue your learning journey and track your progress
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Courses
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Calendar className="mr-2 h-5 w-5" />
                  My Schedule
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
              title="Enrolled Courses"
              value={enrolledCourses.length}
              description="Active courses"
              icon={BookOpen}
              variant="primary"
            />
            <StatsCard
              title="Completed Courses"
              value="2"
              description="Certificates earned"
              icon={Award}
              variant="success"
            />
            <StatsCard
              title="Learning Hours"
              value="47"
              description="This month"
              icon={Clock}
              trend={{ value: 23.5, isPositive: true }}
              variant="warning"
            />
            <StatsCard
              title="Average Score"
              value="88%"
              description="Quiz performance"
              icon={Target}
              trend={{ value: 5.2, isPositive: true }}
              variant="destructive"
            />
          </div>

          {/* Progress and Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning Progress */}
            <Card className="dashboard-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your weekly learning activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="progress" 
                      stroke="hsl(var(--student-accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--student-accent))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your learning milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {achievement.earned ? <CheckCircle className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${achievement.earned ? '' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Current Courses */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="course-card p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lesson 12 of {course.total_lessons}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    
                    <Button variant="student" className="w-full">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Deadlines */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Don't miss these important dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      deadline.type === 'assignment' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                    }`}>
                      {deadline.type === 'assignment' ? 
                        <CheckCircle className="h-5 w-5" /> : 
                        <BookOpen className="h-5 w-5" />
                      }
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{deadline.task}</h4>
                      <p className="text-sm text-muted-foreground">{deadline.course}</p>
                    </div>
                    <Badge variant={deadline.due === '2 days' ? 'destructive' : 'outline'}>
                      Due in {deadline.due}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your learning preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{course.level}</Badge>
                        <span className="text-sm text-muted-foreground">${course.price}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;