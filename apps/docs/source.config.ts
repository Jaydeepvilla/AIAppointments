import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';
import remarkReadingTime from 'remark-reading-time';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      title: z.string(),
      description: z.string().optional(),
      category: z.string().optional(),
      status: z.enum(['draft', 'published']).default('published'),
    }),
  }
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkReadingTime],
  }
});
