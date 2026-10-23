import { type ComponentType } from 'react';

import { type Config } from '@markdoc/markdoc';

import {
  DOMAIN_MARKDOC_COMPONENTS,
  DOMAIN_MARKDOC_TAGS,
} from '../domain-markdown/domain-markdown.constants';
import MarkdocWorkflowInput from '../markdoc-workflow-payload/markdoc-workflow-input';
import {
  workflowInputMarkdocSchema,
  workflowResultMarkdocSchema,
  workflowSearchAttributesMarkdocSchema,
} from '../markdoc-workflow-payload/markdoc-workflow-payload.markdoc';
import MarkdocWorkflowResult from '../markdoc-workflow-payload/markdoc-workflow-result';
import MarkdocWorkflowSearchAttributes from '../markdoc-workflow-payload/markdoc-workflow-search-attributes';

// Workflow pages also have a domain, so they include the domain tags
export const WORKFLOW_MARKDOC_TAGS: NonNullable<Config['tags']> = {
  ...DOMAIN_MARKDOC_TAGS,
  input: workflowInputMarkdocSchema,
  result: workflowResultMarkdocSchema,
  searchAttributes: workflowSearchAttributesMarkdocSchema,
};

export const WORKFLOW_MARKDOC_COMPONENTS: Record<
  string,
  ComponentType<never>
> = {
  ...DOMAIN_MARKDOC_COMPONENTS,
  MarkdocWorkflowInput,
  MarkdocWorkflowResult,
  MarkdocWorkflowSearchAttributes,
};
