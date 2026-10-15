import { type Schema } from '@markdoc/markdoc';

export const workflowsListMarkdocSchema: Schema = {
  render: 'MarkdocWorkflowsList',
  selfClosing: true,
  attributes: {
    query: { type: String, required: true },
    pageSize: { type: Number, required: false },
    columns: { type: String, required: false },
    domain: { type: String, required: false },
    cluster: { type: String, required: false },
  },
};
