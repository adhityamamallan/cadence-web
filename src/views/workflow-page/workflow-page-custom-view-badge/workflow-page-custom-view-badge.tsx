'use client';

import React from 'react';

import { Badge } from 'baseui/badge';
import { useParams } from 'next/navigation';

import decodeUrlParams from '@/utils/decode-url-params';
import useWorkflowCustomViewTabTitle from '@/views/workflow-custom-view/hooks/use-workflow-custom-view-tab-title';

import { type WorkflowPageTabsParams } from '../workflow-page-tabs/workflow-page-tabs.types';

import { overrides } from './workflow-page-custom-view-badge.styles';

export default function WorkflowPageCustomViewBadge() {
  const params = useParams<WorkflowPageTabsParams>();
  const { domain, cluster, workflowId, runId } = decodeUrlParams(
    params
  ) as WorkflowPageTabsParams;

  const customViewTitle = useWorkflowCustomViewTabTitle({
    domain,
    cluster,
    workflowId,
    runId,
  });

  if (!customViewTitle) return null;

  return <Badge content="custom" overrides={overrides.badge} />;
}
