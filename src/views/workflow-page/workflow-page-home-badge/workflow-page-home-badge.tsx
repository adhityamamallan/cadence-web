'use client';

import React from 'react';

import { Badge } from 'baseui/badge';
import { useParams } from 'next/navigation';

import decodeUrlParams from '@/utils/decode-url-params';
import useWorkflowHomeTabTitle from '@/views/workflow-home/hooks/use-workflow-home-tab-title';

import { type WorkflowPageTabsParams } from '../workflow-page-tabs/workflow-page-tabs.types';

import { overrides } from './workflow-page-home-badge.styles';

export default function WorkflowPageHomeBadge() {
  const params = useParams<WorkflowPageTabsParams>();
  const { domain, cluster, workflowId, runId } = decodeUrlParams(
    params
  ) as WorkflowPageTabsParams;

  const homeTitle = useWorkflowHomeTabTitle({
    domain,
    cluster,
    workflowId,
    runId,
  });

  if (!homeTitle) return null;

  return <Badge content="Home" overrides={overrides.badge} />;
}
