import { render, screen } from '@/test-utils/rtl';

import WorkflowMarkdown from '../workflow-markdown';
import {
  WORKFLOW_MARKDOC_COMPONENTS,
  WORKFLOW_MARKDOC_TAGS,
} from '../workflow-markdown.constants';

jest.mock('@/components/markdown/markdown', () =>
  jest.fn(({ markdown, domain, cluster, workflowId, runId }) => (
    <div>
      Markdown Mock: {markdown} {domain} {cluster} {workflowId} {runId}
    </div>
  ))
);

describe(WorkflowMarkdown.name, () => {
  it('registers the workflows tag', () => {
    expect(WORKFLOW_MARKDOC_TAGS).toHaveProperty('workflows');
    expect(WORKFLOW_MARKDOC_COMPONENTS).toHaveProperty('MarkdocWorkflowsList');
  });

  it('passes markdown and context props through', () => {
    setup();
    expect(screen.getByText('Markdown Mock: # hi d c w r')).toBeInTheDocument();
  });

  it('supplies the workflow tags and components', () => {
    setup();
    const Markdown = jest.requireMock('@/components/markdown/markdown');
    expect(Markdown).toHaveBeenCalledWith(
      expect.objectContaining({
        extraTags: WORKFLOW_MARKDOC_TAGS,
        extraComponents: WORKFLOW_MARKDOC_COMPONENTS,
      }),
      expect.anything()
    );
  });
});

function setup() {
  render(
    <WorkflowMarkdown
      markdown="# hi"
      domain="d"
      cluster="c"
      workflowId="w"
      runId="r"
    />
  );
}
