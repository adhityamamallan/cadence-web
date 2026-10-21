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
