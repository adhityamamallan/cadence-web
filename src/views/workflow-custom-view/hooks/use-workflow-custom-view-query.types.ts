import { type WorkflowPageTabContentParams } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

export type UseWorkflowCustomViewQueryParams = Pick<
  WorkflowPageTabContentParams,
  'domain' | 'cluster' | 'workflowId' | 'runId'
>;

export type UseWorkflowCustomViewQueryOptions = {
  enabled: boolean;
  refetchInterval?: number | false;
};
