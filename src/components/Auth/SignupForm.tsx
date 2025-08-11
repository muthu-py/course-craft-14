import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const user = await signup(formData.email, formData.password, formData.name, formData.role as UserRole);
      toast({
        title: "Account created successfully!",
        description: "Welcome to CourseCraft. You can now start learning.",
      });
      
      // Redirect based on returned role
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: (error as Error)?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'admin-accent';
      case 'teacher': return 'teacher-accent';
      case 'student': return 'student-accent';
      default: return '';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin': return 'Manage platform, users, and analytics';
      case 'teacher': return 'Create and manage courses for students';
      case 'student': return 'Learn from expert-led courses';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md dashboard-card animate-bounce-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary p-3 rounded-lg">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Join CourseCraft</CardTitle>
          <CardDescription>
            Create your account and start learning today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I want to...</Label>
              <Select value={formData.role} onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-student-accent"></div>
                      <div>
                        <div className="font-medium">Learn as a Student</div>
                        <div className="text-xs text-muted-foreground">Enroll in courses and earn certificates</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="teacher">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-teacher-accent"></div>
                      <div>
                        <div className="font-medium">Teach as an Instructor</div>
                        <div className="text-xs text-muted-foreground">Create and sell courses to students</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-admin-accent"></div>
                      <div>
                        <div className="font-medium">Manage as Admin</div>
                        <div className="text-xs text-muted-foreground">Oversee platform and users</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {formData.role && (
                <p className={`text-xs ${getRoleColor(formData.role)}`}>
                  {getRoleDescription(formData.role)}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};