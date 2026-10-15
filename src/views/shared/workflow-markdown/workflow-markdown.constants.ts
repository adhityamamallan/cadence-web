import { type ComponentType } from 'react';

import { type Config } from '@markdoc/markdoc';

import MarkdocWorkflowsList from '../markdoc-workflows-list/markdoc-workflows-list';
import { workflowsListMarkdocSchema } from '../markdoc-workflows-list/markdoc-workflows-list.markdoc';

export const WORKFLOW_MARKDOC_TAGS: NonNullable<Config['tags']> = {
  workflows: workflowsListMarkdocSchema,
};

export const WORKFLOW_MARKDOC_COMPONENTS: Record<
  string,
  ComponentType<never>
> = {
  MarkdocWorkflowsList,
};
