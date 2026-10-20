import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

import { WORKFLOW_CUSTOM_VIEW_QUERY_NAME } from '../workflow-custom-view.constants';
import { type WorkflowCustomViewContent } from '../workflow-custom-view.types';

type QueryState<T> = {
  data?: T;
  error?: RequestError | null;
  isLoading?: boolean;
};

export default function getWorkflowCustomViewContent({
  isEnabled,
  isArchived,
  queryTypes,
  customViewQuery,
}: {
  isEnabled: boolean;
  isArchived: boolean;
  queryTypes: QueryState<FetchWorkflowQueryTypesResponse>;
  customViewQuery: QueryState<QueryWorkflowResponse>;
}): WorkflowCustomViewContent {
  if (!isEnabled) {
    return { mode: 'disabled' };
  }

  if (isArchived) {
    return { mode: 'archived' };
  }

  if (queryTypes.isLoading) {
    return { mode: 'loading' };
  }

  if (queryTypes.error) {
    return { mode: 'error', description: queryTypes.error.message };
  }

  if (!queryTypes.data?.queryTypes.includes(WORKFLOW_CUSTOM_VIEW_QUERY_NAME)) {
    return { mode: 'not-set-up' };
  }

  // A failed background refetch keeps showing the last good page
  if (customViewQuery.error && !customViewQuery.data) {
    return { mode: 'error', description: customViewQuery.error.message };
  }

  if (customViewQuery.isLoading || !customViewQuery.data) {
    return { mode: 'loading' };
  }

  const { data } = customViewQuery;

  if (data.rejected) {
    return {
      mode: 'error',
      description: `The workflow is closed with status ${data.rejected.closeStatus}`,
    };
  }

  if (
    data.result?.cadenceResponseType === 'formattedData' &&
    data.result?.format === 'text/markdown'
  ) {
    return { mode: 'ready', markdown: data.result.data };
  }

  return {
    mode: 'invalid-format',
    description: `The "${WORKFLOW_CUSTOM_VIEW_QUERY_NAME}" query must return a formattedData result with the format "text/markdown".`,
  };
}
