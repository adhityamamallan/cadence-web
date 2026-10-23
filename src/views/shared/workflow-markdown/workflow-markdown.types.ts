import { type Props as DomainMarkdownProps } from '../domain-markdown/domain-markdown.types';

export type Props = DomainMarkdownProps & {
  workflowId?: string;
  runId?: string;
};
