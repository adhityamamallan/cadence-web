import { parse as parseMarkdoc } from '@markdoc/markdoc';
import { parse as parseYaml } from 'yaml';

import customViewFrontmatterSchema from '../schemas/custom-view-frontmatter-schema';
import { type CustomViewFrontmatter } from '../workflow-custom-view.types';

export default function getCustomViewFrontmatter(
  markdown: string
): CustomViewFrontmatter {
  try {
    const rawFrontmatter: unknown =
      parseMarkdoc(markdown).attributes.frontmatter;
    if (typeof rawFrontmatter !== 'string') return {};

    const result = customViewFrontmatterSchema.safeParse(
      parseYaml(rawFrontmatter)
    );
    if (!result.success || !result.data.title) return {};

    return { title: result.data.title };
  } catch {
    return {};
  }
}
