import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { CourseCard } from '@/components/Course/CourseCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Users, 
  Star, 
  Search,
  Play,
  CheckCircle,
  Award,
  TrendingUp,
  Filter,
  ArrowRight,
  GraduationCap,
  Clock,
  Globe
} from 'lucide-react';
import { mockCourses, mockAnalytics } from '@/data/mockData';

const Home: React.FC = () => {
  const featuredCourses = mockCourses.slice(0, 6);
  const categories = ['All', 'Web Development', 'Data Science', 'Design', 'Machine Learning', 'DevOps', 'Marketing'];
  
  const stats = [
    { 
      icon: BookOpen, 
      value: mockAnalytics.total_courses, 
      label: 'Courses Available',
      color: 'text-primary'
    },
    { 
      icon: Users, 
      value: mockAnalytics.total_students.toLocaleString(), 
      label: 'Active Students',
      color: 'text-student-accent'
    },
    { 
      icon: GraduationCap, 
      value: mockAnalytics.total_teachers, 
      label: 'Expert Instructors',
      color: 'text-teacher-accent'
    },
    { 
      icon: Award, 
      value: '98%', 
      label: 'Success Rate',
      color: 'text-success'
    }
  ];

  const features = [
    {
      icon: Play,
      title: 'Interactive Learning',
      description: 'Engage with hands-on projects and real-world scenarios'
    },
    {
      icon: CheckCircle,
      title: 'Certified Courses',
      description: 'Earn industry-recognized certificates upon completion'
    },
    {
      icon: Clock,
      title: 'Learn at Your Pace',
      description: 'Flexible schedule that adapts to your lifestyle'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with learners and experts worldwide'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="hero-gradient text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Learn Without Limits
                </h1>
                <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
                  Join thousands of learners mastering new skills with our comprehensive online courses
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="What do you want to learn?"
                    className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                  />
                </div>
                <Button variant="secondary" size="lg" className="whitespace-nowrap">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className={`inline-flex p-3 rounded-lg bg-background shadow-sm ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose CourseCraft?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience learning like never before with our innovative platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="dashboard-card text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Courses */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Popular Courses</h2>
                <p className="text-muted-foreground">Discover our most enrolled courses</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/courses">
                  View All Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === 'All' ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  actionButton="enroll"
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Join our community of learners and unlock your potential today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/signup">
                  Start Learning Today
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-card border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-primary p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    CourseCraft
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Empowering learners worldwide with quality online education.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link to="/courses" className="hover:text-foreground">Browse Courses</Link></li>
                  <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                  <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
                  <li><Link to="/community" className="hover:text-foreground">Community</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                  <li><Link to="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 CourseCraft. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default Home;