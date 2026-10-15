import { type ComponentType } from 'react';

import { type Config } from '@markdoc/markdoc';

export const WORKFLOW_MARKDOC_TAGS: NonNullable<Config['tags']> = {};

export const WORKFLOW_MARKDOC_COMPONENTS: Record<
  string,
  ComponentType<never>
> = {};
