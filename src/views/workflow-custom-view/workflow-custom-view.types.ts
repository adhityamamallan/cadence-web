export type WorkflowCustomViewContent =
  | { mode: 'loading' }
  | { mode: 'disabled' }
  | { mode: 'archived' }
  | { mode: 'not-set-up' }
  | { mode: 'error'; description: string }
  | { mode: 'invalid-format'; description: string }
  | { mode: 'ready'; markdown: string; title?: string };

export type CustomViewFrontmatter = {
  title?: string;
};

export type MarkdownQueryResult = {
  cadenceResponseType: 'formattedData';
  format: 'text/markdown';
  data: string;
};
