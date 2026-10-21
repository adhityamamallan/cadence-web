import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';

import getCustomViewFrontmatter from './get-custom-view-frontmatter';
import isMarkdownQueryResult from './is-markdown-query-result';

export default function getCustomViewTabTitle(
  data: QueryWorkflowResponse | undefined
): string | undefined {
  if (!data || data.rejected || !isMarkdownQueryResult(data.result)) {
    return undefined;
  }
  return getCustomViewFrontmatter(data.result.data).title;
}
