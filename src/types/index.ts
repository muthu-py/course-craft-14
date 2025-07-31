// Core types for the Course Marketplace

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructor_id: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail?: string;
  enrolled_count: number;
  rating: number;
  total_lessons: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  video_url?: string;
  duration: number;
  order: number;
  is_free: boolean;
  created_at: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  lesson_id?: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  time_limit: number; // in minutes
  passing_score: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string | number;
  points: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number; // percentage
  status: 'active' | 'completed' | 'dropped';
  enrolled_at: string;
  completed_at?: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  submission_type: 'file' | 'text' | 'link';
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  content: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
}

export interface Analytics {
  total_courses: number;
  total_students: number;
  total_teachers: number;
  total_revenue: number;
  course_completion_rate: number;
  average_rating: number;
  monthly_signups: number[];
  revenue_by_month: number[];
  popular_categories: Array<{
    category: string;
    count: number;
  }>;
}