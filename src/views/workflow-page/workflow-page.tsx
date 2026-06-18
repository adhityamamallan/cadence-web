import React from 'react';

import decodeUrlParams from '@/utils/decode-url-params';

import WorkflowPageHeader from './workflow-page-header/workflow-page-header';
import WorkflowPageTabs from './workflow-page-tabs/workflow-page-tabs';
import type { Props, WorkflowPageParams } from './workflow-page.types';

export default async function WorkflowPage({ params, children }: Props) {
  const decodedParams = decodeUrlParams(await params) as WorkflowPageParams;

  return (
    <>
      <WorkflowPageHeader
        domain={decodedParams.domain}
        workflowId={decodedParams.workflowId}
        runId={decodedParams.runId}
        cluster={decodedParams.cluster}
      />
      <WorkflowPageTabs />
      {children}
    </>
  );
}
