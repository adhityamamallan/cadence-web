import parseErrorMessageForQueryTypes from '@/route-handlers/fetch-workflow-query-types/helpers/parse-error-message-for-query-types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

import { WORKFLOW_CUSTOM_VIEW_QUERY_NAME } from '../workflow-custom-view.constants';
import { type WorkflowCustomViewContent } from '../workflow-custom-view.types';

import getCustomViewFrontmatter from './get-custom-view-frontmatter';
import isMarkdownQueryResult from './is-markdown-query-result';

export default function getWorkflowCustomViewContent({
  isEnabled,
  isArchived,
  customViewQuery,
}: {
  isEnabled: boolean;
  isArchived: boolean;
  customViewQuery: {
    data?: QueryWorkflowResponse;
    error?: RequestError | null;
    isLoading?: boolean;
  };
}): WorkflowCustomViewContent {
  if (!isEnabled) {
    return { mode: 'disabled' };
  }

  if (isArchived) {
    return { mode: 'archived' };
  }

  // A failed background refetch keeps showing the last good page
  if (customViewQuery.error && !customViewQuery.data) {
    // A workflow without the query handler lists its known query types in the error
    if (parseErrorMessageForQueryTypes(customViewQuery.error.message)) {
      return { mode: 'not-set-up' };
    }
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

  if (isMarkdownQueryResult(data.result)) {
    const { title } = getCustomViewFrontmatter(data.result.data);
    return { mode: 'ready', markdown: data.result.data, title };
  }

  return {
    mode: 'invalid-format',
    description: `The "${WORKFLOW_CUSTOM_VIEW_QUERY_NAME}" query must return a formattedData result with the format "text/markdown".`,
  };
}
