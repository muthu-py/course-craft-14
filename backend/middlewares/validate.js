import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage
      });
    }
    
    next();
  };
};

// Validation schemas
export const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
  }),

  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('student', 'teacher', 'admin').default('student').messages({
      'any.only': 'Role must be student, teacher, or admin'
    })
  })
};

export const courseSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
    description: Joi.string().min(10).max(1000).required().messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 1000 characters',
      'any.required': 'Description is required'
    }),
    price: Joi.number().min(0).required().messages({
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required'
    }),
    duration: Joi.string().required().messages({
      'any.required': 'Duration is required'
    }),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced').required().messages({
      'any.only': 'Level must be beginner, intermediate, or advanced',
      'any.required': 'Level is required'
    }),
    category: Joi.string().required().messages({
      'any.required': 'Category is required'
    }),
    tags: Joi.array().items(Joi.string()),
    requirements: Joi.array().items(Joi.string()),
    learningOutcomes: Joi.array().items(Joi.string())
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().min(10).max(1000),
    price: Joi.number().min(0),
    duration: Joi.string(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
    category: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    requirements: Joi.array().items(Joi.string()),
    learningOutcomes: Joi.array().items(Joi.string()),
    isPublished: Joi.boolean(),
    isFeatured: Joi.boolean()
  })
};

export const assignmentSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
    description: Joi.string().min(10).max(1000).required().messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 1000 characters',
      'any.required': 'Description is required'
    }),
    dueDate: Joi.date().greater('now').required().messages({
      'date.greater': 'Due date must be in the future',
      'any.required': 'Due date is required'
    }),
    maxScore: Joi.number().min(1).required().messages({
      'number.min': 'Maximum score must be at least 1',
      'any.required': 'Maximum score is required'
    }),
    submissionType: Joi.string().valid('file', 'text', 'link', 'quiz').required().messages({
      'any.only': 'Submission type must be file, text, link, or quiz',
      'any.required': 'Submission type is required'
    }),
    allowLateSubmission: Joi.boolean().default(false),
    latePenalty: Joi.number().min(0).max(100).default(0),
    questions: Joi.array().items(Joi.object({
      question: Joi.string().required(),
      type: Joi.string().valid('multiple_choice', 'true_false', 'short_answer', 'essay').required(),
      options: Joi.array().items(Joi.string()),
      correctAnswer: Joi.string(),
      points: Joi.number().min(1).required()
    }))
  }),

  submit: Joi.object({
    content: Joi.string().required().messages({
      'any.required': 'Submission content is required'
    }),
    fileUrl: Joi.string().uri().optional()
  })
};

export const feedbackSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
    content: Joi.string().min(10).max(2000).required().messages({
      'string.min': 'Content must be at least 10 characters long',
      'string.max': 'Content cannot exceed 2000 characters',
      'any.required': 'Content is required'
    }),
    type: Joi.string().valid('general', 'technical', 'content', 'teaching', 'other').required().messages({
      'any.only': 'Type must be general, technical, content, teaching, or other',
      'any.required': 'Type is required'
    }),
    rating: Joi.number().min(1).max(5).required().messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required'
    }),
    isAnonymous: Joi.boolean().default(false)
  }),

  respond: Joi.object({
    content: Joi.string().min(10).max(2000).required().messages({
      'string.min': 'Response must be at least 10 characters long',
      'string.max': 'Response cannot exceed 2000 characters',
      'any.required': 'Response content is required'
    })
  })
};

export const placementSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
    company: Joi.string().required().messages({
      'any.required': 'Company name is required'
    }),
    description: Joi.string().min(10).max(2000).required().messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 2000 characters',
      'any.required': 'Description is required'
    }),
    location: Joi.string().required().messages({
      'any.required': 'Location is required'
    }),
    type: Joi.string().valid('full-time', 'part-time', 'internship', 'contract', 'freelance').required().messages({
      'any.only': 'Type must be full-time, part-time, internship, contract, or freelance',
      'any.required': 'Employment type is required'
    }),
    salary: Joi.object({
      min: Joi.number().min(0).required(),
      max: Joi.number().min(0).required(),
      currency: Joi.string().default('USD')
    }).required(),
    requirements: Joi.array().items(Joi.string()),
    responsibilities: Joi.array().items(Joi.string()),
    skills: Joi.array().items(Joi.string()),
    experience: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'lead').required().messages({
      'any.only': 'Experience must be entry, junior, mid, senior, or lead',
      'any.required': 'Experience level is required'
    }),
    benefits: Joi.array().items(Joi.string()),
    contactEmail: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Contact email is required'
    }),
    contactPhone: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    applicationDeadline: Joi.date().greater('now').required().messages({
      'date.greater': 'Application deadline must be in the future',
      'any.required': 'Application deadline is required'
    })
  }),

  apply: Joi.object({
    resume: Joi.string().required().messages({
      'any.required': 'Resume is required'
    }),
    coverLetter: Joi.string().max(1000).optional().messages({
      'string.max': 'Cover letter cannot exceed 1000 characters'
    })
  })
};

export const attendanceSchemas = {
  mark: Joi.object({
    students: Joi.array().items(Joi.object({
      student: Joi.string().required(),
      status: Joi.string().valid('present', 'absent', 'late', 'excused').required(),
      notes: Joi.string().max(500).optional()
    })).min(1).required().messages({
      'array.min': 'At least one student must be marked',
      'any.required': 'Students data is required'
    }),
    session: Joi.string().required().messages({
      'any.required': 'Session identifier is required'
    })
  })
}; 