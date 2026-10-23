import { type RequestError } from '@/utils/request/request-error';

import getWorkflowHomeContent from '../get-workflow-home-content';

const markdownResponse = {
  result: {
    cadenceResponseType: 'formattedData',
    format: 'text/markdown',
    data: '# Hello',
  },
  rejected: null,
};

describe(getWorkflowHomeContent.name, () => {
  it('returns disabled when the feature is disabled', () => {
    expect(setup({ isEnabled: false })).toEqual({ mode: 'disabled' });
  });

  it('returns archived for archived workflows', () => {
    expect(setup({ isArchived: true })).toEqual({ mode: 'archived' });
  });

  it('returns not-set-up when the error lists the known query types', () => {
    expect(
      setup({
        homeQuery: {
          error: {
            message:
              'unknown queryType cadence_web_home. KnownQueryTypes=[__stack_trace other]',
          } as RequestError,
        },
      })
    ).toEqual({ mode: 'not-set-up' });
  });

  it('returns not-set-up when the known query types list is empty', () => {
    expect(
      setup({
        homeQuery: {
          error: {
            message: 'unknown queryType. KnownQueryTypes=[]',
          } as RequestError,
        },
      })
    ).toEqual({ mode: 'not-set-up' });
  });

  it('returns loading while the home page query loads', () => {
    expect(setup({ homeQuery: { isLoading: true } })).toEqual({
      mode: 'loading',
    });
  });

  it('returns loading when the home page query has not started', () => {
    expect(setup({ homeQuery: {} })).toEqual({ mode: 'loading' });
  });

  it('returns an error when the home page query fails', () => {
    expect(
      setup({
        homeQuery: { error: { message: 'timeout' } as RequestError },
      })
    ).toEqual({ mode: 'error', description: 'timeout' });
  });

  it('returns an error when the home page query is rejected', () => {
    expect(
      setup({
        homeQuery: {
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
        homeQuery: { data: { result: { a: 1 }, rejected: null } },
      }).mode
    ).toBe('invalid-format');
  });

  it('returns invalid-format when the result is null', () => {
    expect(
      setup({
        homeQuery: { data: { result: null, rejected: null } },
      }).mode
    ).toBe('invalid-format');
  });

  it('keeps the last good page when a background refetch fails', () => {
    expect(
      setup({
        homeQuery: {
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
        homeQuery: {
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
  overrides: Partial<Parameters<typeof getWorkflowHomeContent>[0]>
) {
  return getWorkflowHomeContent({
    isEnabled: true,
    isArchived: false,
    homeQuery: { data: markdownResponse },
    ...overrides,
  });
}
