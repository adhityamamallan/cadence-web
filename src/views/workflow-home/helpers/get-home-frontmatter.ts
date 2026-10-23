import { parse as parseMarkdoc } from '@markdoc/markdoc';
import { parse as parseYaml } from 'yaml';

import homeFrontmatterSchema from '../schemas/home-frontmatter-schema';
import { type HomeFrontmatter } from '../workflow-home.types';

export default function getHomeFrontmatter(markdown: string): HomeFrontmatter {
  try {
    const rawFrontmatter: unknown =
      parseMarkdoc(markdown).attributes.frontmatter;
    if (typeof rawFrontmatter !== 'string') return {};

    const result = homeFrontmatterSchema.safeParse(parseYaml(rawFrontmatter));
    if (!result.success || !result.data.title) return {};

    return { title: result.data.title };
  } catch {
    return {};
  }
}
