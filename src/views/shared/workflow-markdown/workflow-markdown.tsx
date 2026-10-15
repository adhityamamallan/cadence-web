'use client';
import React from 'react';

import Markdown from '@/components/markdown/markdown';

import {
  WORKFLOW_MARKDOC_COMPONENTS,
  WORKFLOW_MARKDOC_TAGS,
} from './workflow-markdown.constants';
import { type Props } from './workflow-markdown.types';

export default function WorkflowMarkdown(props: Props) {
  return (
    <Markdown
      markdown={props.markdown}
      domain={props.domain}
      cluster={props.cluster}
      workflowId={props.workflowId}
      runId={props.runId}
      extraTags={WORKFLOW_MARKDOC_TAGS}
      extraComponents={WORKFLOW_MARKDOC_COMPONENTS}
    />
  );
}
