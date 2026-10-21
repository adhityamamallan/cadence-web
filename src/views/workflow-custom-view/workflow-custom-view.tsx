'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import ErrorPanel from '@/components/error-panel/error-panel';
import PageSection from '@/components/page-section/page-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import WorkflowMarkdown from '@/views/shared/workflow-markdown/workflow-markdown';

import { useDescribeWorkflow } from '../workflow-page/hooks/use-describe-workflow';
import { type WorkflowPageTabContentProps } from '../workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import getHasCustomViewMemo from './helpers/get-has-custom-view-memo';
import getWorkflowCustomViewContent from './helpers/get-workflow-custom-view-content';
import WorkflowCustomViewEmpty from './workflow-custom-view-empty/workflow-custom-view-empty';
import WorkflowCustomViewHeader from './workflow-custom-view-header/workflow-custom-view-header';
import {
  WORKFLOW_CUSTOM_VIEW_ACTION_REFETCH_DELAY_MS,
  WORKFLOW_CUSTOM_VIEW_MESSAGES,
  WORKFLOW_CUSTOM_VIEW_QUERY_NAME,
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

  const hasMemo = getHasCustomViewMemo(workflowDetails);

  const shouldDetect = isCustomViewEnabled && !isArchived && !isDetailsLoading;
  // The memo says the query exists, so the query types check is skipped
  const shouldFetchQueryTypes = shouldDetect && !hasMemo;

  const queryTypesQuery = useQuery<
    FetchWorkflowQueryTypesResponse,
    RequestError
  >({
    queryKey: ['query_types', { domain, cluster, workflowId, runId }],
    queryFn: () =>
      request(
        `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/query`
      ).then((res) => res.json()),
    enabled: shouldFetchQueryTypes,
  });

  const hasCustomViewQuery =
    hasMemo ||
    (queryTypesQuery.data?.queryTypes.includes(
      WORKFLOW_CUSTOM_VIEW_QUERY_NAME
    ) ??
      false);

  const customViewQuery = useQuery<QueryWorkflowResponse, RequestError>({
    // Same key shape as the Queries tab, so both tabs share the cached result.
    queryKey: [
      'workflow_query',
      { workflowId, runId, name: WORKFLOW_CUSTOM_VIEW_QUERY_NAME },
      undefined,
    ],
    queryFn: () =>
      request(
        `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/query/${WORKFLOW_CUSTOM_VIEW_QUERY_NAME}`,
        { method: 'POST' }
      ).then((res) => res.json()),
    enabled: shouldDetect && hasCustomViewQuery,
    retry: false,
    // Pauses on its own while the browser tab is hidden
    refetchInterval:
      isRunning && refreshIntervalMs > 0 ? refreshIntervalMs : false,
  });

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

  const { refetch: refetchQueryTypes } = queryTypesQuery;
  const handleRetry = useCallback(() => {
    if (shouldFetchQueryTypes) refetchQueryTypes();
    if (hasCustomViewQuery) refetchCustomView();
  }, [
    refetchQueryTypes,
    shouldFetchQueryTypes,
    hasCustomViewQuery,
    refetchCustomView,
  ]);

  const content = getWorkflowCustomViewContent({
    isEnabled: isCustomViewEnabled,
    isArchived,
    hasMemo,
    queryTypes: {
      data: queryTypesQuery.data,
      error: queryTypesQuery.error,
      isLoading: queryTypesQuery.isLoading,
    },
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
              onClick: handleRetry,
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
              title={content.title}
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
