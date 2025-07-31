import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Play,
  DollarSign
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact' | 'featured';
  showInstructor?: boolean;
  showPrice?: boolean;
  actionButton?: 'enroll' | 'view' | 'edit' | 'manage';
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  variant = 'default',
  showInstructor = true,
  showPrice = true,
  actionButton = 'view'
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getActionButton = () => {
    switch (actionButton) {
      case 'enroll':
        return (
          <Button variant="gradient" className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Enroll Now
          </Button>
        );
      case 'edit':
        return (
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/teacher/courses/${course.id}/edit`}>
              Edit Course
            </Link>
          </Button>
        );
      case 'manage':
        return (
          <Button variant="secondary" className="w-full" asChild>
            <Link to={`/teacher/courses/${course.id}`}>
              Manage
            </Link>
          </Button>
        );
      default:
        return (
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/courses/${course.id}`}>
              View Details
            </Link>
          </Button>
        );
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="course-card h-full">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold line-clamp-2">{course.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{course.duration}</span>
                <span>•</span>
                <Badge variant="outline" className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{course.rating}</span>
                </div>
                {showPrice && (
                  <span className="font-semibold">${course.price}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="course-card h-full flex flex-col">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-primary rounded-t-lg flex items-center justify-center">
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <BookOpen className="h-16 w-16 text-primary-foreground" />
          )}
        </div>
        <Badge 
          className={`absolute top-3 right-3 ${getLevelColor(course.level)}`}
        >
          {course.level}
        </Badge>
        {showPrice && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              <DollarSign className="h-3 w-3 mr-1" />
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 flex-1">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2 mb-2">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {course.description}
            </p>
          </div>

          {showInstructor && (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                  {course.instructor.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{course.instructor}</p>
                <p className="text-xs text-muted-foreground">Instructor</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.total_lessons} lessons</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{course.rating}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{course.enrolled_count}</span>
              </div>
            </div>
            <Badge variant="outline">{course.category}</Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {getActionButton()}
      </CardFooter>
    </Card>
  );
};