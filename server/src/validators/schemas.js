const { z } = require('zod');

exports.registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

exports.careerSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  category: z.string().min(1),
  skills: z.array(z.string()).optional(),
  avgSalary: z.number().nonnegative().optional(),
  demand: z.enum(['Low', 'Medium', 'High']).optional(),
  image: z.string().optional(),
});

exports.categorySchema = z.object({
  name: z.string().min(2),
  icon: z.string().optional(),
  color: z.string().optional(),
});

exports.skillSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  demandScore: z.number().min(0).max(100).optional(),
});

exports.progressSchema = z.object({
  percent: z.number().min(0).max(100),
  label: z.string().optional(),
});
