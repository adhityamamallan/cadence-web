import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import WorkflowCustomView from '../workflow-custom-view';
import {
  WORKFLOW_CUSTOM_VIEW_MEMO_KEY,
  WORKFLOW_CUSTOM_VIEW_QUERY_NAME,
} from '../workflow-custom-view.constants';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message, description, actions }) => (
    <div>
      <div>Mock ErrorPanel: {message}</div>
      <div>{description}</div>
      {actions?.map((action: { label: string; onClick: () => void }) => (
        <button key={action.label} onClick={action.onClick}>
          {action.label}
        </button>
      ))}
    </div>
  ))
);

jest.mock('../workflow-custom-view-empty/workflow-custom-view-empty', () =>
  jest.fn(() => <div>Mock Empty</div>)
);

const mockMarkdownProps = jest.fn();
jest.mock('@/views/shared/workflow-markdown/workflow-markdown', () =>
  jest.fn((props) => {
    mockMarkdownProps(props);
    return <div>Mock Markdown: {props.markdown}</div>;
  })
);

const params = {
  domain: 'd',
  cluster: 'c',
  workflowId: 'w',
  runId: 'r',
  workflowTab: 'summary',
} as const;

describe(WorkflowCustomView.name, () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the disabled state when the feature is off', async () => {
    await setup({ enabled: false });
    expect(
      await screen.findByText('Mock ErrorPanel: Custom views are not enabled')
    ).toBeInTheDocument();
  });

  it('renders the archived state for archived workflows', async () => {
    await setup({ archived: true });
    expect(
      await screen.findByText(
        'Mock ErrorPanel: Custom views are not available for archived workflows'
      )
    ).toBeInTheDocument();
  });

  it('renders the custom view when the workflow has the query', async () => {
    await setup({});
    expect(
      await screen.findByText('Mock Markdown: # Custom view')
    ).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('renders the empty state when there is no custom view query', async () => {
    await setup({ queryTypes: ['other'] });
    expect(await screen.findByText('Mock Empty')).toBeInTheDocument();
    expect(screen.queryByText('Refresh')).toBeNull();
  });

  it('skips the query types request when the memo is set', async () => {
    const { getQueryTypesCalls } = await setup({
      hasMemo: true,
      queryTypes: [],
    });
    expect(
      await screen.findByText('Mock Markdown: # Custom view')
    ).toBeInTheDocument();
    expect(getQueryTypesCalls()).toBe(0);
  });

  it('renders the error state when the query fails', async () => {
    await setup({ queryError: true });
    expect(
      await screen.findByText('Mock ErrorPanel: Could not load the custom view')
    ).toBeInTheDocument();
  });

  it('renders the error state when the query types fail', async () => {
    await setup({ queryTypesError: true });
    expect(
      await screen.findByText('Mock ErrorPanel: Could not load the custom view')
    ).toBeInTheDocument();
  });

  it('refetches the queries when Retry is clicked', async () => {
    const { user, getCustomViewQueryCalls } = await setup({
      queryError: true,
    });
    await user.click(await screen.findByText('Retry'));
    await waitFor(() => expect(getCustomViewQueryCalls()).toBe(2));
  });

  it('renders the invalid format state when the result is not markdown', async () => {
    await setup({ nonMarkdown: true });
    expect(
      await screen.findByText(
        'Mock ErrorPanel: The custom view is not in a supported format'
      )
    ).toBeInTheDocument();
  });

  it('refetches the custom view query when Refresh is clicked', async () => {
    const { user, getCustomViewQueryCalls } = await setup({});
    await screen.findByText('Mock Markdown: # Custom view');
    expect(getCustomViewQueryCalls()).toBe(1);
    await user.click(screen.getByText('Refresh'));
    await waitFor(() => expect(getCustomViewQueryCalls()).toBe(2));
  });

  it('refetches the custom view query on action success, then again after a delay', async () => {
    const { getCustomViewQueryCalls } = await setup({});
    await screen.findByText('Mock Markdown: # Custom view');
    mockMarkdownProps.mock.calls[0][0].onActionSuccess();
    await waitFor(() => expect(getCustomViewQueryCalls()).toBe(2));
    await waitFor(() => expect(getCustomViewQueryCalls()).toBe(3), {
      timeout: 2000,
    });
  });

  it('polls the custom view query while the workflow is running', async () => {
    const { getCustomViewQueryCalls } = await setup({
      isRunning: true,
      refreshIntervalMs: 50,
    });
    await screen.findByText('Mock Markdown: # Custom view');
    await waitFor(() => expect(getCustomViewQueryCalls()).toBeGreaterThan(2));
  });

  it('does not poll the custom view query when the workflow is closed', async () => {
    const { getCustomViewQueryCalls } = await setup({ refreshIntervalMs: 50 });
    await screen.findByText('Mock Markdown: # Custom view');
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(getCustomViewQueryCalls()).toBe(1);
  });

  it('does not poll the custom view query when the interval is 0', async () => {
    const { getCustomViewQueryCalls } = await setup({ isRunning: true });
    await screen.findByText('Mock Markdown: # Custom view');
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(getCustomViewQueryCalls()).toBe(1);
  });
});

async function setup({
  enabled = true,
  queryTypes = [WORKFLOW_CUSTOM_VIEW_QUERY_NAME],
  queryError,
  queryTypesError,
  archived,
  nonMarkdown,
  isRunning = false,
  refreshIntervalMs = 0,
  hasMemo = false,
}: {
  enabled?: boolean;
  queryTypes?: string[];
  queryError?: boolean;
  queryTypesError?: boolean;
  archived?: boolean;
  nonMarkdown?: boolean;
  isRunning?: boolean;
  refreshIntervalMs?: number;
  hasMemo?: boolean;
}) {
  const user = userEvent.setup();
  let customViewQueryCalls = 0;
  let queryTypesCalls = 0;

  render(
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowCustomView params={params} />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            const configKey = new URL(request.url).searchParams.get(
              'configKey'
            );
            if (configKey === 'WORKFLOW_CUSTOM_VIEW_REFRESH_INTERVAL_MS') {
              return HttpResponse.json(refreshIntervalMs);
            }
            return HttpResponse.json(enabled);
          },
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: hasMemo
            ? {
                ...mockDescribeWorkflowResponse,
                workflowExecutionInfo: {
                  ...mockDescribeWorkflowResponse.workflowExecutionInfo,
                  memo: {
                    fields: {
                      [WORKFLOW_CUSTOM_VIEW_MEMO_KEY]: {
                        data: Buffer.from('true').toString('base64'),
                      },
                    },
                  },
                },
              }
            : isRunning
              ? {
                  ...mockDescribeWorkflowResponse,
                  workflowExecutionInfo: {
                    ...mockDescribeWorkflowResponse.workflowExecutionInfo,
                    closeStatus: null,
                    closeEvent: null,
                  },
                }
              : archived
                ? {
                    ...mockDescribeWorkflowResponse,
                    workflowExecutionInfo: {
                      ...mockDescribeWorkflowResponse.workflowExecutionInfo,
                      isArchived: true,
                    },
                  }
                : mockDescribeWorkflowResponse,
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            queryTypesCalls++;
            return queryTypesError
              ? HttpResponse.json({ message: 'nope' }, { status: 500 })
              : HttpResponse.json({ queryTypes });
          },
        },
        {
          path: `/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query/${WORKFLOW_CUSTOM_VIEW_QUERY_NAME}`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
            customViewQueryCalls++;
            if (queryError) {
              return HttpResponse.json({ message: 'nope' }, { status: 500 });
            }
            return HttpResponse.json({
              result: nonMarkdown
                ? { a: 1 }
                : {
                    cadenceResponseType: 'formattedData',
                    format: 'text/markdown',
                    data: '# Custom view',
                  },
              rejected: null,
            });
          },
        },
      ],
    }
  );

  return {
    user,
    getCustomViewQueryCalls: () => customViewQueryCalls,
    getQueryTypesCalls: () => queryTypesCalls,
  };
}
