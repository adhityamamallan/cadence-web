import { render, screen } from '@/test-utils/rtl';

import DomainMarkdown from '../domain-markdown';
import {
  DOMAIN_MARKDOC_COMPONENTS,
  DOMAIN_MARKDOC_TAGS,
} from '../domain-markdown.constants';

jest.mock('@/components/markdown/markdown', () =>
  jest.fn(({ markdown, domain, cluster, workflowId, runId }) => (
    <div>
      Markdown Mock: {markdown} {domain} {cluster} {workflowId} {runId}
    </div>
  ))
);

describe(DomainMarkdown.name, () => {
  it('registers only the domain tags', () => {
    expect(Object.keys(DOMAIN_MARKDOC_TAGS)).toEqual(['workflows']);
    expect(DOMAIN_MARKDOC_COMPONENTS).toHaveProperty('MarkdocWorkflowsList');
  });

  it('passes markdown and domain props through', () => {
    setup();
    expect(screen.getByText('Markdown Mock: # hi d c')).toBeInTheDocument();
  });

  it('supplies the domain tags and components', () => {
    setup();
    const Markdown = jest.requireMock('@/components/markdown/markdown');
    expect(Markdown).toHaveBeenCalledWith(
      expect.objectContaining({
        extraTags: DOMAIN_MARKDOC_TAGS,
        extraComponents: DOMAIN_MARKDOC_COMPONENTS,
      }),
      expect.anything()
    );
  });
});

function setup() {
  render(<DomainMarkdown markdown="# hi" domain="d" cluster="c" />);
}
