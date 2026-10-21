import { type RequestError } from '@/utils/request/request-error';

import { WORKFLOW_CUSTOM_VIEW_QUERY_NAME } from '../../workflow-custom-view.constants';
import getWorkflowCustomViewContent from '../get-workflow-custom-view-content';

const markdownResponse = {
  result: {
    cadenceResponseType: 'formattedData',
    format: 'text/markdown',
    data: '# Hello',
  },
  rejected: null,
};

describe(getWorkflowCustomViewContent.name, () => {
  it('returns disabled when the feature is disabled', () => {
    expect(setup({ isEnabled: false })).toEqual({ mode: 'disabled' });
  });

  it('returns archived for archived workflows', () => {
    expect(setup({ isArchived: true })).toEqual({ mode: 'archived' });
  });

  it('returns loading while query types load', () => {
    expect(setup({ queryTypes: { isLoading: true } })).toEqual({
      mode: 'loading',
    });
  });

  it('returns an error when query types fail', () => {
    expect(
      setup({
        queryTypes: { error: { message: 'boom' } as RequestError },
      })
    ).toEqual({ mode: 'error', description: 'boom' });
  });

  it('returns not-set-up when the workflow has no custom view query', () => {
    expect(setup({ queryTypes: { data: { queryTypes: ['other'] } } })).toEqual({
      mode: 'not-set-up',
    });
  });

  it('skips the query types checks when the memo is set', () => {
    expect(
      setup({
        hasMemo: true,
        queryTypes: { error: { message: 'boom' } as RequestError },
      })
    ).toEqual({ mode: 'ready', markdown: '# Hello' });
  });

  it('returns loading while the custom view query loads', () => {
    expect(setup({ customViewQuery: { isLoading: true } })).toEqual({
      mode: 'loading',
    });
  });

  it('returns loading when the custom view query has not started', () => {
    expect(setup({ customViewQuery: {} })).toEqual({ mode: 'loading' });
  });

  it('returns an error when the custom view query fails', () => {
    expect(
      setup({
        customViewQuery: { error: { message: 'timeout' } as RequestError },
      })
    ).toEqual({ mode: 'error', description: 'timeout' });
  });

  it('returns an error when the custom view query is rejected', () => {
    expect(
      setup({
        customViewQuery: {
          data: {
            result: null,
            rejected: { closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' },
          },
        },
      })
    ).toEqual({
      mode: 'error',
      description:
        'The workflow is closed with status WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
    });
  });

  it('returns invalid-format when the result is not markdown', () => {
    expect(
      setup({
        customViewQuery: { data: { result: { a: 1 }, rejected: null } },
      }).mode
    ).toBe('invalid-format');
  });

  it('returns invalid-format when the result is null', () => {
    expect(
      setup({
        customViewQuery: { data: { result: null, rejected: null } },
      }).mode
    ).toBe('invalid-format');
  });

  it('keeps the last good page when a background refetch fails', () => {
    expect(
      setup({
        customViewQuery: {
          data: markdownResponse,
          error: { message: 'timeout' } as RequestError,
        },
      })
    ).toEqual({ mode: 'ready', markdown: '# Hello' });
  });

  it('returns ready with the markdown', () => {
    expect(setup({})).toEqual({ mode: 'ready', markdown: '# Hello' });
  });

  it('returns ready with the title from the frontmatter', () => {
    const markdown = '---\ntitle: My page\n---\n# Hello';
    expect(
      setup({
        customViewQuery: {
          data: {
            ...markdownResponse,
            result: { ...markdownResponse.result, data: markdown },
          },
        },
      })
    ).toEqual({ mode: 'ready', markdown, title: 'My page' });
  });
});

function setup(
  overrides: Partial<Parameters<typeof getWorkflowCustomViewContent>[0]>
) {
  return getWorkflowCustomViewContent({
    isEnabled: true,
    isArchived: false,
    hasMemo: false,
    queryTypes: { data: { queryTypes: [WORKFLOW_CUSTOM_VIEW_QUERY_NAME] } },
    customViewQuery: { data: markdownResponse },
    ...overrides,
  });
}
