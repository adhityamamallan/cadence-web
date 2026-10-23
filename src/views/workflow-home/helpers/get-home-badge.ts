import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';

import getHomeFrontmatter from './get-home-frontmatter';
import isMarkdownQueryResult from './is-markdown-query-result';

export default function getHomeBadge(
  data: QueryWorkflowResponse | undefined
): string | undefined {
  if (!data || data.rejected || !isMarkdownQueryResult(data.result)) {
    return undefined;
  }
  return getHomeFrontmatter(data.result.data).badge;
}
