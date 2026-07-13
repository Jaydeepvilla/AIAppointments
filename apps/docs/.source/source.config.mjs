// source.config.ts
import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";
import remarkReadingTime from "remark-reading-time";
var { docs, meta } = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      title: z.string(),
      description: z.string().optional(),
      category: z.string().optional(),
      status: z.enum(["draft", "published"]).default("published")
    })
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkReadingTime]
  }
});
export {
  source_config_default as default,
  docs,
  meta
};
