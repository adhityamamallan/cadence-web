import { type MarkdownQueryResult } from '../workflow-home.types';

export default function isMarkdownQueryResult(
  result: unknown
): result is MarkdownQueryResult {
  if (typeof result !== 'object' || result === null) return false;
  const candidate = result as Partial<Record<string, unknown>>;
  return (
    candidate.cadenceResponseType === 'formattedData' &&
    candidate.format === 'text/markdown' &&
    typeof candidate.data === 'string'
  );
}
