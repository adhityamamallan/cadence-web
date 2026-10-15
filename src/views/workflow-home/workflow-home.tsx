'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import PageSection from '@/components/page-section/page-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import WorkflowMarkdown from '@/views/shared/workflow-markdown/workflow-markdown';
import WorkflowSummary from '@/views/workflow-summary/workflow-summary';

import workflowPageQueryParamsConfig from '../workflow-page/config/workflow-page-query-params.config';
import { useDescribeWorkflow } from '../workflow-page/hooks/use-describe-workflow';
import { type WorkflowPageTabContentProps } from '../workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import getWorkflowHomeContent from './helpers/get-workflow-home-content';
import WorkflowHomeHeader from './workflow-home-header/workflow-home-header';
import WorkflowHomeNotice from './workflow-home-notice/workflow-home-notice';
import {
  WORKFLOW_HOME_ACTION_REFETCH_DELAY_MS,
  WORKFLOW_HOME_QUERY_NAME,
} from './workflow-home.constants';

export default function WorkflowHome({ params }: WorkflowPageTabContentProps) {
  const { domain, cluster, workflowId, runId } = params;

  const { data: isHomeEnabled } = useSuspenseConfigValue(
    'WORKFLOW_HOME_ENABLED'
  );

  const { data: refreshIntervalMs } = useSuspenseConfigValue(
    'WORKFLOW_HOME_REFRESH_INTERVAL_MS'
  );

  const [{ homeView }, setQueryParams] = usePageQueryParams(
    workflowPageQueryParamsConfig,
    { pageRerender: false, replace: true }
  );

  const { data: workflowDetails, isLoading: isDetailsLoading } =
    useDescribeWorkflow({ domain, cluster, workflowId, runId });
  const isArchived =
    workflowDetails?.workflowExecutionInfo?.isArchived ?? false;
  // Same check as useDescribeWorkflow, which keeps polling until the workflow closes
  const closeStatus = workflowDetails?.workflowExecutionInfo?.closeStatus;
  const isRunning =
    !closeStatus || closeStatus === 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';

  const shouldDetect = isHomeEnabled && !isArchived && !isDetailsLoading;

  const queryTypesQuery = useQuery<
    FetchWorkflowQueryTypesResponse,
    RequestError
  >({
    queryKey: ['query_types', { domain, cluster, workflowId, runId }],
    queryFn: () =>
      request(
        `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/query`
      ).then((res) => res.json()),
    enabled: shouldDetect,
  });

  const hasHomeQuery =
    queryTypesQuery.data?.queryTypes.includes(WORKFLOW_HOME_QUERY_NAME) ??
    false;

  const homeQuery = useQuery<QueryWorkflowResponse, RequestError>({
    // Same key shape as the Queries tab, so both tabs share the cached result.
    queryKey: [
      'workflow_query',
      { workflowId, runId, name: WORKFLOW_HOME_QUERY_NAME },
      undefined,
    ],
    queryFn: () =>
      request(
        `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/query/${WORKFLOW_HOME_QUERY_NAME}`,
        { method: 'POST' }
      ).then((res) => res.json()),
    enabled: shouldDetect && hasHomeQuery,
    retry: false,
    // Pauses on its own while the browser tab is hidden
    refetchInterval:
      isRunning && refreshIntervalMs > 0 ? refreshIntervalMs : false,
  });

  // The worker may not have handled a signal yet when the first refetch runs,
  // so refetch once more after a short delay.
  const { refetch: refetchHome } = homeQuery;
  const delayedRefetchRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(delayedRefetchRef.current), []);
  const handleActionSuccess = useCallback(() => {
    refetchHome();
    clearTimeout(delayedRefetchRef.current);
    delayedRefetchRef.current = setTimeout(
      refetchHome,
      WORKFLOW_HOME_ACTION_REFETCH_DELAY_MS
    );
  }, [refetchHome]);

  // Spin only for manual refreshes, not for background polling
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const handleRefresh = useCallback(async () => {
    setIsManualRefresh(true);
    await refetchHome();
    setIsManualRefresh(false);
  }, [refetchHome]);

  const content = getWorkflowHomeContent({
    isEnabled: isHomeEnabled,
    isArchived,
    queryTypes: {
      data: queryTypesQuery.data,
      error: queryTypesQuery.error,
      isLoading: queryTypesQuery.isLoading,
    },
    homeQuery: {
      data: homeQuery.data,
      error: homeQuery.error,
      isLoading: homeQuery.isLoading,
    },
  });

  if (isDetailsLoading || content.mode === 'loading') {
    return <SectionLoadingIndicator />;
  }

  if (content.mode === 'summary') {
    return <WorkflowSummary params={params} />;
  }

  if (content.mode === 'summary-with-notice') {
    return (
      <>
        <PageSection>
          <WorkflowHomeNotice message={content.notice} />
        </PageSection>
        <WorkflowSummary params={params} />
      </>
    );
  }

  return (
    <>
      <PageSection>
        <WorkflowHomeHeader
          activeView={homeView}
          onViewChange={(view) => setQueryParams({ homeView: view })}
          onRefresh={handleRefresh}
          isRefreshing={isManualRefresh}
        />
      </PageSection>
      {homeView === 'summary' ? (
        <WorkflowSummary params={params} />
      ) : (
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
      )}
    </>
  );
}
