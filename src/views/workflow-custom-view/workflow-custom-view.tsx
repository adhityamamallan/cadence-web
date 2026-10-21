'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import PageSection from '@/components/page-section/page-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import WorkflowMarkdown from '@/views/shared/workflow-markdown/workflow-markdown';

import { useDescribeWorkflow } from '../workflow-page/hooks/use-describe-workflow';
import { type WorkflowPageTabContentProps } from '../workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import getWorkflowCustomViewContent from './helpers/get-workflow-custom-view-content';
import useWorkflowCustomViewQuery from './hooks/use-workflow-custom-view-query';
import WorkflowCustomViewEmpty from './workflow-custom-view-empty/workflow-custom-view-empty';
import WorkflowCustomViewHeader from './workflow-custom-view-header/workflow-custom-view-header';
import {
  WORKFLOW_CUSTOM_VIEW_ACTION_REFETCH_DELAY_MS,
  WORKFLOW_CUSTOM_VIEW_MESSAGES,
} from './workflow-custom-view.constants';

export default function WorkflowCustomView({
  params,
}: WorkflowPageTabContentProps) {
  const { domain, cluster, workflowId, runId } = params;

  const { data: isCustomViewEnabled } = useSuspenseConfigValue(
    'WORKFLOW_CUSTOM_VIEW_ENABLED'
  );

  const { data: refreshIntervalMs } = useSuspenseConfigValue(
    'WORKFLOW_CUSTOM_VIEW_REFRESH_INTERVAL_MS'
  );

  const { data: workflowDetails, isLoading: isDetailsLoading } =
    useDescribeWorkflow({ domain, cluster, workflowId, runId });
  const isArchived =
    workflowDetails?.workflowExecutionInfo?.isArchived ?? false;
  // Same check as useDescribeWorkflow, which keeps polling until the workflow closes
  const closeStatus = workflowDetails?.workflowExecutionInfo?.closeStatus;
  const isRunning =
    !closeStatus || closeStatus === 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';

  const customViewQuery = useWorkflowCustomViewQuery(
    { domain, cluster, workflowId, runId },
    {
      enabled: isCustomViewEnabled && !isArchived && !isDetailsLoading,
      // Pauses on its own while the browser tab is hidden
      refetchInterval:
        isRunning && refreshIntervalMs > 0 ? refreshIntervalMs : false,
    }
  );

  // The worker may not have handled a signal yet when the first refetch runs,
  // so refetch once more after a short delay.
  const { refetch: refetchCustomView } = customViewQuery;
  const delayedRefetchRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(delayedRefetchRef.current), []);
  const handleActionSuccess = useCallback(() => {
    refetchCustomView();
    clearTimeout(delayedRefetchRef.current);
    delayedRefetchRef.current = setTimeout(
      refetchCustomView,
      WORKFLOW_CUSTOM_VIEW_ACTION_REFETCH_DELAY_MS
    );
  }, [refetchCustomView]);

  // Spin only for manual refreshes, not for background polling
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const handleRefresh = useCallback(async () => {
    setIsManualRefresh(true);
    await refetchCustomView();
    setIsManualRefresh(false);
  }, [refetchCustomView]);

  const content = getWorkflowCustomViewContent({
    isEnabled: isCustomViewEnabled,
    isArchived,
    customViewQuery: {
      data: customViewQuery.data,
      error: customViewQuery.error,
      isLoading: customViewQuery.isLoading,
    },
  });

  if (isDetailsLoading || content.mode === 'loading') {
    return <SectionLoadingIndicator />;
  }

  switch (content.mode) {
    case 'disabled':
      return (
        <ErrorPanel
          omitLogging
          message={WORKFLOW_CUSTOM_VIEW_MESSAGES.disabled}
        />
      );
    case 'archived':
      return (
        <ErrorPanel
          omitLogging
          message={WORKFLOW_CUSTOM_VIEW_MESSAGES.archived}
        />
      );
    case 'not-set-up':
      return <WorkflowCustomViewEmpty />;
    case 'error':
      return (
        <ErrorPanel
          omitLogging
          message={WORKFLOW_CUSTOM_VIEW_MESSAGES.error}
          description={content.description}
          actions={[
            {
              kind: 'callback',
              label: 'Retry',
              onClick: () => refetchCustomView(),
              buttonKind: 'secondary',
            },
          ]}
        />
      );
    case 'invalid-format':
      return (
        <ErrorPanel
          omitLogging
          message={WORKFLOW_CUSTOM_VIEW_MESSAGES.invalidFormat}
          description={content.description}
        />
      );
    case 'ready':
      return (
        <>
          <PageSection>
            <WorkflowCustomViewHeader
              onRefresh={handleRefresh}
              isRefreshing={isManualRefresh}
            />
          </PageSection>
          <PageSection>
            <WorkflowMarkdown
              markdown={content.markdown}
              domain={domain}
              cluster={cluster}
              workflowId={workflowId}
              runId={runId}
              onActionSuccess={handleActionSuccess}
            />
          </PageSection>
        </>
      );
    default:
      return null;
  }
}
