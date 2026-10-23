import { parse as parseMarkdoc } from '@markdoc/markdoc';
import omitBy from 'lodash/omitBy';
import { parse as parseYaml } from 'yaml';

import homeFrontmatterSchema from '../schemas/home-frontmatter-schema';
import { type HomeFrontmatter } from '../workflow-home.types';

export default function getHomeFrontmatter(markdown: string): HomeFrontmatter {
  try {
    const rawFrontmatter: unknown =
      parseMarkdoc(markdown).attributes.frontmatter;
    if (typeof rawFrontmatter !== 'string') return {};

    const result = homeFrontmatterSchema.safeParse(parseYaml(rawFrontmatter));
    if (!result.success) return {};

    const { title, badge } = result.data;
    return omitBy({ title, badge }, (value) => value === undefined);
  } catch {
    return {};
  }
}
