import { type ComponentType } from 'react';

import { type Config } from '@markdoc/markdoc';

import MarkdocWorkflowsList from '../markdoc-workflows-list/markdoc-workflows-list';
import { workflowsListMarkdocSchema } from '../markdoc-workflows-list/markdoc-workflows-list.markdoc';

// Tags that need only a domain and cluster from the page
export const DOMAIN_MARKDOC_TAGS: NonNullable<Config['tags']> = {
  workflows: workflowsListMarkdocSchema,
};

export const DOMAIN_MARKDOC_COMPONENTS: Record<string, ComponentType<never>> = {
  MarkdocWorkflowsList,
};
