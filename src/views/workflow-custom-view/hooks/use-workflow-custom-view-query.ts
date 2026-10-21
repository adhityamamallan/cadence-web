import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { WORKFLOW_CUSTOM_VIEW_QUERY_NAME } from '../workflow-custom-view.constants';

import {
  type UseWorkflowCustomViewQueryOptions,
  type UseWorkflowCustomViewQueryParams,
} from './use-workflow-custom-view-query.types';

export default function useWorkflowCustomViewQuery(
  { domain, cluster, workflowId, runId }: UseWorkflowCustomViewQueryParams,
  { enabled, refetchInterval = false }: UseWorkflowCustomViewQueryOptions
): UseQueryResult<QueryWorkflowResponse, RequestError> {
  return useQuery<QueryWorkflowResponse, RequestError>({
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
    enabled,
    retry: false,
    refetchInterval,
  });
}
