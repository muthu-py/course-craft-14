import { Course, User, Analytics } from '@/types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Development Bootcamp',
    description: 'Master React from basics to advanced concepts including hooks, context, and testing. Build real-world projects and learn industry best practices.',
    instructor: 'Sarah Johnson',
    instructor_id: 'teacher1',
    price: 99.99,
    duration: '12 weeks',
    level: 'intermediate',
    category: 'Web Development',
    enrolled_count: 1250,
    rating: 4.8,
    total_lessons: 45,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Python for Data Science',
    description: 'Learn Python programming for data analysis, visualization, and machine learning. Includes NumPy, Pandas, and Matplotlib.',
    instructor: 'Dr. Michael Chen',
    instructor_id: 'teacher2',
    price: 79.99,
    duration: '10 weeks',
    level: 'beginner',
    category: 'Data Science',
    enrolled_count: 890,
    rating: 4.6,
    total_lessons: 38,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    title: 'Advanced Machine Learning',
    description: 'Deep dive into advanced ML algorithms, neural networks, and deep learning. Hands-on projects with TensorFlow and PyTorch.',
    instructor: 'Dr. Emily Rodriguez',
    instructor_id: 'teacher3',
    price: 149.99,
    duration: '16 weeks',
    level: 'advanced',
    category: 'Machine Learning',
    enrolled_count: 456,
    rating: 4.9,
    total_lessons: 62,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design. Master design tools and create stunning user interfaces.',
    instructor: 'Alex Thompson',
    instructor_id: 'teacher4',
    price: 69.99,
    duration: '8 weeks',
    level: 'beginner',
    category: 'Design',
    enrolled_count: 672,
    rating: 4.7,
    total_lessons: 28,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: '5',
    title: 'DevOps and Cloud Computing',
    description: 'Master DevOps practices and cloud platforms. Learn Docker, Kubernetes, AWS, and CI/CD pipelines.',
    instructor: 'James Wilson',
    instructor_id: 'teacher5',
    price: 129.99,
    duration: '14 weeks',
    level: 'intermediate',
    category: 'DevOps',
    enrolled_count: 523,
    rating: 4.5,
    total_lessons: 52,
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
  },
  {
    id: '6',
    title: 'Digital Marketing Masterclass',
    description: 'Complete guide to digital marketing including SEO, social media, content marketing, and analytics.',
    instructor: 'Lisa Brown',
    instructor_id: 'teacher6',
    price: 59.99,
    duration: '6 weeks',
    level: 'beginner',
    category: 'Marketing',
    enrolled_count: 934,
    rating: 4.4,
    total_lessons: 24,
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z',
  },
];

export const mockUsers: User[] = [
  {
    id: 'admin1',
    email: 'admin@coursecraft.com',
    name: 'Admin User',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'teacher1',
    email: 'sarah@coursecraft.com',
    name: 'Sarah Johnson',
    role: 'teacher',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'student1',
    email: 'john@coursecraft.com',
    name: 'John Smith',
    role: 'student',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

export const mockAnalytics: Analytics = {
  total_courses: 156,
  total_students: 12450,
  total_teachers: 89,
  total_revenue: 485920,
  course_completion_rate: 78.5,
  average_rating: 4.6,
  monthly_signups: [120, 145, 167, 198, 234, 256, 289, 312, 345, 378, 401, 425],
  revenue_by_month: [25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000, 52000, 55000, 58000, 62000],
  popular_categories: [
    { category: 'Web Development', count: 45 },
    { category: 'Data Science', count: 38 },
    { category: 'Machine Learning', count: 32 },
    { category: 'Design', count: 28 },
    { category: 'DevOps', count: 13 },
  ],
};

export const getCoursesForUser = (userId: string, role: string): Course[] => {
  if (role === 'teacher') {
    return mockCourses.filter(course => course.instructor_id === userId);
  }
  return mockCourses;
};

export const getEnrolledCourses = (userId: string): Course[] => {
  // Mock enrolled courses for students
  return mockCourses.slice(0, 3);
};

export const getRecommendedCourses = (userId: string): Course[] => {
  // Mock recommended courses
  return mockCourses.slice(3, 6);
};