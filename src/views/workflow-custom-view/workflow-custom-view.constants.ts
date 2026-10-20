// Contract with workers: the query handler a workflow registers to provide its custom view.
export const WORKFLOW_CUSTOM_VIEW_QUERY_NAME = 'cadence_web_custom_view';

export const WORKFLOW_CUSTOM_VIEW_ACTION_REFETCH_DELAY_MS = 1000;

export const WORKFLOW_CUSTOM_VIEW_MESSAGES = {
  disabled: 'Custom views are not enabled',
  archived: 'Custom views are not available for archived workflows',
  error: 'Could not load the custom view',
  invalidFormat: 'The custom view is not in a supported format',
  empty: 'This workflow has no custom view.',
} as const;

export const WORKFLOW_CUSTOM_VIEW_EMPTY_DESCRIPTION =
  'The worker code of a workflow defines this page with a query that returns Markdown.';

export const WORKFLOW_CUSTOM_VIEW_GO_SNIPPET = `workflow.SetQueryHandler(ctx, "${WORKFLOW_CUSTOM_VIEW_QUERY_NAME}", func() (map[string]string, error) {
    return map[string]string{
        "cadenceResponseType": "formattedData",
        "format":              "text/markdown",
        "data":                "## Hello from my workflow",
    }, nil
})`;

// Contract with workflow starters: a memo with this key set to true marks a workflow as having a custom view.
export const WORKFLOW_CUSTOM_VIEW_MEMO_KEY = WORKFLOW_CUSTOM_VIEW_QUERY_NAME;

export const WORKFLOW_CUSTOM_VIEW_MEMO_TEXTS = {
  required: 'Set this memo when you start the workflow.',
  optional:
    'Optional: set this memo when you start the workflow, so the view loads faster.',
} as const;

export const WORKFLOW_CUSTOM_VIEW_MEMO_GO_SNIPPET = `client.StartWorkflowOptions{
    // ...
    Memo: map[string]interface{}{"${WORKFLOW_CUSTOM_VIEW_MEMO_KEY}": true},
}`;
