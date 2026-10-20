'use client';
import React, { useMemo } from 'react';

import omit from 'lodash/omit';
import { useRouter, useParams } from 'next/navigation';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import PageTabs from '@/components/page-tabs/page-tabs';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import decodeUrlParams from '@/utils/decode-url-params';
import WorkflowActions from '@/views/workflow-actions/workflow-actions';
import getHasCustomViewMemo from '@/views/workflow-custom-view/helpers/get-has-custom-view-memo';

import workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import { useDescribeWorkflow } from '../hooks/use-describe-workflow';
import WorkflowPageCliCommandsButton from '../workflow-page-cli-commands-button/workflow-page-cli-commands-button';

import { styled } from './workflow-page-tabs.styles';
import type { WorkflowPageTabsParams } from './workflow-page-tabs.types';

export default function WorkflowPageTabs() {
  const router = useRouter();
  const params = useParams<WorkflowPageTabsParams>();
  const decodedParams = decodeUrlParams(params) as WorkflowPageTabsParams;

  const { data: isWorkflowDiagnosticsEnabled } = useSuspenseConfigValue(
    'WORKFLOW_DIAGNOSTICS_ENABLED'
  );

  const { data: isWorkflowDiagnosticsInHistoryEnabled } =
    useSuspenseConfigValue('WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED');

  const { data: isWorkflowCustomViewEnabled } = useSuspenseConfigValue(
    'WORKFLOW_CUSTOM_VIEW_ENABLED'
  );

  const { data: isCustomViewMemoRequired } = useSuspenseConfigValue(
    'WORKFLOW_CUSTOM_VIEW_MEMO_REQUIRED'
  );

  // Shares the cache with the rest of the page. Skipped when the memo is not needed.
  const { data: workflowDetails } = useDescribeWorkflow({
    domain: decodedParams.domain,
    cluster: decodedParams.cluster,
    workflowId: decodedParams.workflowId,
    runId: decodedParams.runId,
    enabled: isWorkflowCustomViewEnabled && isCustomViewMemoRequired,
  });
  const hasCustomViewMemo = getHasCustomViewMemo(workflowDetails);
  const shouldShowCustomView =
    isWorkflowCustomViewEnabled &&
    (!isCustomViewMemoRequired || hasCustomViewMemo);

  const shouldShowDiagnosticsInSeparateTab =
    isWorkflowDiagnosticsEnabled && !isWorkflowDiagnosticsInHistoryEnabled;

  const filteredTabsConfig = useMemo(
    () =>
      omit(workflowPageTabsConfig, [
        ...(shouldShowDiagnosticsInSeparateTab ? [] : ['diagnostics' as const]),
        ...(shouldShowCustomView ? [] : ['custom-view' as const]),
      ]),
    [shouldShowDiagnosticsInSeparateTab, shouldShowCustomView]
  );

  const tabList = useMemo(
    () =>
      Object.entries(filteredTabsConfig).map(([key, tabConfig]) => ({
        key,
        title: tabConfig.title,
        artwork: tabConfig.artwork,
        endEnhancer: tabConfig.endEnhancer,
      })),
    [filteredTabsConfig]
  );

  return (
    <PageTabs
      selectedTab={decodedParams.workflowTab}
      tabList={tabList}
      setSelectedTab={(newTab) => {
        router.push(encodeURIComponent(newTab.toString()));
      }}
      endEnhancer={
        <styled.EndButtonsContainer>
          <WorkflowPageCliCommandsButton />
          <ErrorBoundary fallbackRender={() => null}>
            <WorkflowActions />
          </ErrorBoundary>
        </styled.EndButtonsContainer>
      }
    />
  );
}
