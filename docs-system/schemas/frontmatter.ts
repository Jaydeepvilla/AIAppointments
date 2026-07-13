import { z } from 'zod';

export const frontmatterSchema = z.object({
  title: z.string().min(3).max(60),
  description: z.string().min(10).max(160),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'deprecated']).default('published'),
  author: z.string().optional(),
  version: z.string().optional()
});