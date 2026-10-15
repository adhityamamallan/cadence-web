import { type RequestError } from '@/utils/request/request-error';

import { WORKFLOW_HOME_QUERY_NAME } from '../../workflow-home.constants';
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
  it('returns summary when the feature is disabled', () => {
    expect(setup({ isEnabled: false })).toEqual({ mode: 'summary' });
  });

  it('returns summary for archived workflows', () => {
    expect(setup({ isArchived: true })).toEqual({ mode: 'summary' });
  });

  it('returns loading while query types load', () => {
    expect(setup({ queryTypes: { isLoading: true } })).toEqual({
      mode: 'loading',
    });
  });

  it('returns a notice when query types fail', () => {
    expect(
      setup({
        queryTypes: { error: { message: 'boom' } as RequestError },
      })
    ).toEqual({
      mode: 'summary-with-notice',
      notice: 'Could not check for a home page: boom',
    });
  });

  it('returns summary when the workflow has no home query', () => {
    expect(setup({ queryTypes: { data: { queryTypes: ['other'] } } })).toEqual({
      mode: 'summary',
    });
  });

  it('returns loading while the home query loads', () => {
    expect(setup({ homeQuery: { isLoading: true } })).toEqual({
      mode: 'loading',
    });
  });

  it('returns a notice when the home query fails', () => {
    expect(
      setup({ homeQuery: { error: { message: 'timeout' } as RequestError } })
    ).toEqual({
      mode: 'summary-with-notice',
      notice: 'Could not load the home page: timeout',
    });
  });

  it('returns a notice when the home query is rejected', () => {
    const content = setup({
      homeQuery: {
        data: {
          result: null,
          rejected: { closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' },
        },
      },
    });
    expect(content.mode).toBe('summary-with-notice');
  });

  it('returns a notice when the result is not markdown', () => {
    const content = setup({
      homeQuery: { data: { result: { a: 1 }, rejected: null } },
    });
    expect(content.mode).toBe('summary-with-notice');
  });

  it('keeps the last good page when a background refetch fails', () => {
    const content = setup({
      homeQuery: {
        data: markdownResponse,
        error: { message: 'timeout' } as RequestError,
      },
    });
    expect(content).toEqual({ mode: 'home', markdown: '# Hello' });
  });

  it('returns a notice when the result is null', () => {
    const content = setup({
      homeQuery: { data: { result: null, rejected: null } },
    });
    expect(content.mode).toBe('summary-with-notice');
  });

  it('returns home with the markdown', () => {
    expect(setup({})).toEqual({ mode: 'home', markdown: '# Hello' });
  });
});

function setup(
  overrides: Partial<Parameters<typeof getWorkflowHomeContent>[0]>
) {
  return getWorkflowHomeContent({
    isEnabled: true,
    isArchived: false,
    queryTypes: { data: { queryTypes: [WORKFLOW_HOME_QUERY_NAME] } },
    homeQuery: { data: markdownResponse },
    ...overrides,
  });
}
