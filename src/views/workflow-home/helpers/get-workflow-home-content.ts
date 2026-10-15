import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

import { WORKFLOW_HOME_QUERY_NAME } from '../workflow-home.constants';
import { type WorkflowHomeContent } from '../workflow-home.types';

type QueryState<T> = {
  data?: T;
  error?: RequestError | null;
  isLoading?: boolean;
};

export default function getWorkflowHomeContent({
  isEnabled,
  isArchived,
  queryTypes,
  homeQuery,
}: {
  isEnabled: boolean;
  isArchived: boolean;
  queryTypes: QueryState<FetchWorkflowQueryTypesResponse>;
  homeQuery: QueryState<QueryWorkflowResponse>;
}): WorkflowHomeContent {
  if (!isEnabled || isArchived) {
    return { mode: 'summary' };
  }

  if (queryTypes.isLoading) {
    return { mode: 'loading' };
  }

  if (queryTypes.error) {
    return {
      mode: 'summary-with-notice',
      notice: `Could not check for a home page: ${queryTypes.error.message}`,
    };
  }

  if (!queryTypes.data?.queryTypes.includes(WORKFLOW_HOME_QUERY_NAME)) {
    return { mode: 'summary' };
  }

  // A failed background refetch keeps showing the last good page
  if (homeQuery.error && !homeQuery.data) {
    return {
      mode: 'summary-with-notice',
      notice: `Could not load the home page: ${homeQuery.error.message}`,
    };
  }

  if (homeQuery.isLoading || !homeQuery.data) {
    return { mode: 'loading' };
  }

  const { data } = homeQuery;

  if (data.rejected) {
    return {
      mode: 'summary-with-notice',
      notice: `Could not load the home page: workflow is closed with status ${data.rejected.closeStatus}`,
    };
  }

  if (
    data.result?.cadenceResponseType === 'formattedData' &&
    data.result?.format === 'text/markdown'
  ) {
    return { mode: 'home', markdown: data.result.data };
  }

  return {
    mode: 'summary-with-notice',
    notice: `The "${WORKFLOW_HOME_QUERY_NAME}" query did not return Markdown, so the home page cannot be shown`,
  };
}
