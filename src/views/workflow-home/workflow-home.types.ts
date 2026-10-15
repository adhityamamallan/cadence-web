export type WorkflowHomeView = 'home' | 'summary';

export type WorkflowHomeContent =
  | { mode: 'loading' }
  | { mode: 'summary' }
  | { mode: 'summary-with-notice'; notice: string }
  | { mode: 'home'; markdown: string };
