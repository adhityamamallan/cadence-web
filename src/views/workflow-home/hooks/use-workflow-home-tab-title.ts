import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';

import getHomeTabTitle from '../helpers/get-home-tab-title';

import useWorkflowHomeQuery from './use-workflow-home-query';
import { type UseWorkflowHomeTabTitleParams } from './use-workflow-home-tab-title.types';

export default function useWorkflowHomeTabTitle({
  domain,
  cluster,
  workflowId,
  runId,
}: UseWorkflowHomeTabTitleParams): string | undefined {
  const { data: isWorkflowHomeEnabled } = useSuspenseConfigValue(
    'WORKFLOW_HOME_ENABLED'
  );

  // Shares the cache with the describe query of the page
  const { data: workflowDetails } = useDescribeWorkflow({
    domain,
    cluster,
    workflowId,
    runId,
    enabled: isWorkflowHomeEnabled,
  });
  const isArchived =
    workflowDetails?.workflowExecutionInfo?.isArchived ?? false;

  // The tab title comes from the frontmatter of the page, so the query runs on page load
  const { data: homeData } = useWorkflowHomeQuery(
    { domain, cluster, workflowId, runId },
    { enabled: isWorkflowHomeEnabled && !!workflowDetails && !isArchived }
  );

  return getHomeTabTitle(homeData);
}
