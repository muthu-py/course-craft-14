import React from 'react';
import { Layout } from '@/components/Layout/Layout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { CourseCard } from '@/components/Course/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  GraduationCap,
  Settings,
  BarChart3,
  PlusCircle,
  Eye
} from 'lucide-react';
import { mockAnalytics, mockCourses, mockUsers } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const chartData = [
    { month: 'Jan', signups: 120, revenue: 25000 },
    { month: 'Feb', signups: 145, revenue: 28000 },
    { month: 'Mar', signups: 167, revenue: 32000 },
    { month: 'Apr', signups: 198, revenue: 35000 },
    { month: 'May', signups: 234, revenue: 38000 },
    { month: 'Jun', signups: 256, revenue: 42000 },
  ];

  const categoryData = mockAnalytics.popular_categories.map((cat, index) => ({
    ...cat,
    color: `hsl(${220 + index * 40}, 70%, 50%)`
  }));

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-hero text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-primary-foreground/80 mt-2">
                  Manage your course marketplace and monitor performance
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" size="lg">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Reports
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
              title="Total Students"
              value={mockAnalytics.total_students.toLocaleString()}
              description="Active learners"
              icon={Users}
              trend={{ value: 12.5, isPositive: true }}
              variant="primary"
            />
            <StatsCard
              title="Total Courses"
              value={mockAnalytics.total_courses}
              description="Published courses"
              icon={BookOpen}
              trend={{ value: 8.2, isPositive: true }}
              variant="success"
            />
            <StatsCard
              title="Total Revenue"
              value={`$${(mockAnalytics.total_revenue / 1000).toFixed(0)}K`}
              description="This month"
              icon={DollarSign}
              trend={{ value: 15.3, isPositive: true }}
              variant="warning"
            />
            <StatsCard
              title="Completion Rate"
              value={`${mockAnalytics.course_completion_rate}%`}
              description="Average completion"
              icon={TrendingUp}
              trend={{ value: 3.1, isPositive: true }}
              variant="destructive"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Revenue & Signups Trend</CardTitle>
                <CardDescription>Monthly performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                    <Bar dataKey="signups" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Course Categories</CardTitle>
                <CardDescription>Popular course categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ category, count }) => `${category}: ${count}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Courses */}
            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Courses</CardTitle>
                  <CardDescription>Newly published courses</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCourses.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium line-clamp-1">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        by {course.instructor}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{course.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {course.enrolled_count} students
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${course.price}</p>
                      <p className="text-sm text-muted-foreground">{course.level}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* User Management */}
            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Recent user activities</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {mockAnalytics.total_students.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-teacher-accent">
                      {mockAnalytics.total_teachers}
                    </div>
                    <div className="text-sm text-muted-foreground">Teachers</div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-2xl font-bold text-admin-accent">12</div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-sm text-primary-foreground font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          user.role === 'admin' ? 'admin-accent' :
                          user.role === 'teacher' ? 'teacher-accent' : 'student-accent'
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <PlusCircle className="h-6 w-6 mb-2" />
                  Create Course
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <UserPlus className="h-6 w-6 mb-2" />
                  Add User
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;