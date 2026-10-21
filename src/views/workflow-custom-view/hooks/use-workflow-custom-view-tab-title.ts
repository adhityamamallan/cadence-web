import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';

import getCustomViewTabTitle from '../helpers/get-custom-view-tab-title';

import useWorkflowCustomViewQuery from './use-workflow-custom-view-query';
import { type UseWorkflowCustomViewTabTitleParams } from './use-workflow-custom-view-tab-title.types';

export default function useWorkflowCustomViewTabTitle({
  domain,
  cluster,
  workflowId,
  runId,
}: UseWorkflowCustomViewTabTitleParams): string | undefined {
  const { data: isWorkflowCustomViewEnabled } = useSuspenseConfigValue(
    'WORKFLOW_CUSTOM_VIEW_ENABLED'
  );

  // Shares the cache with the describe query of the page
  const { data: workflowDetails } = useDescribeWorkflow({
    domain,
    cluster,
    workflowId,
    runId,
    enabled: isWorkflowCustomViewEnabled,
  });
  const isArchived =
    workflowDetails?.workflowExecutionInfo?.isArchived ?? false;

  // The tab title comes from the frontmatter of the page, so the query runs on page load
  const { data: customViewData } = useWorkflowCustomViewQuery(
    { domain, cluster, workflowId, runId },
    { enabled: isWorkflowCustomViewEnabled && !!workflowDetails && !isArchived }
  );

  return getCustomViewTabTitle(customViewData);
}
