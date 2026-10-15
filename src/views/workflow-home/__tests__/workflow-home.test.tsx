import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import WorkflowHome from '../workflow-home';
import { WORKFLOW_HOME_QUERY_NAME } from '../workflow-home.constants';

jest.mock('@/hooks/use-page-query-params/use-page-query-params');
const mockSetQueryParams = jest.fn();
const mockUsePageQueryParams = usePageQueryParams as jest.MockedFunction<
  typeof usePageQueryParams
>;

jest.mock('@/views/workflow-summary/workflow-summary', () =>
  jest.fn(() => <div>Mock Summary</div>)
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

describe(WorkflowHome.name, () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders summary when the feature is off', async () => {
    await setup({ enabled: false });
    expect(await screen.findByText('Mock Summary')).toBeInTheDocument();
  });

  it('renders the home page when the workflow has the home query', async () => {
    await setup({});
    expect(
      await screen.findByText('Mock Markdown: # Home')
    ).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('renders summary without a toggle when there is no home query', async () => {
    await setup({ queryTypes: ['other'] });
    expect(await screen.findByText('Mock Summary')).toBeInTheDocument();
    expect(screen.queryByText('Refresh')).toBeNull();
  });

  it('renders summary with a notice when the home query fails', async () => {
    await setup({ queryError: true });
    expect(await screen.findByText('Mock Summary')).toBeInTheDocument();
    expect(
      screen.getByText(/Could not load the home page/)
    ).toBeInTheDocument();
  });

  it('renders summary with a notice when the result is not markdown', async () => {
    await setup({ nonMarkdown: true });
    expect(await screen.findByText('Mock Summary')).toBeInTheDocument();
    expect(screen.getByText(/did not return Markdown/)).toBeInTheDocument();
  });

  it('renders summary under the toggle when the Summary view is selected', async () => {
    await setup({ homeView: 'summary' });
    expect(await screen.findByText('Mock Summary')).toBeInTheDocument();
  });

  it('updates the view query param when the toggle changes', async () => {
    const { user } = await setup({});
    await screen.findByText('Mock Markdown: # Home');
    await user.click(screen.getByText('Summary'));
    expect(mockSetQueryParams).toHaveBeenCalledWith({ homeView: 'summary' });
  });

  it('refetches the home query when Refresh is clicked', async () => {
    const { user, getHomeQueryCalls } = await setup({});
    await screen.findByText('Mock Markdown: # Home');
    expect(getHomeQueryCalls()).toBe(1);
    await user.click(screen.getByText('Refresh'));
    await waitFor(() => expect(getHomeQueryCalls()).toBe(2));
  });

  it('refetches the home query on action success, then again after a delay', async () => {
    const { getHomeQueryCalls } = await setup({});
    await screen.findByText('Mock Markdown: # Home');
    mockMarkdownProps.mock.calls[0][0].onActionSuccess();
    await waitFor(() => expect(getHomeQueryCalls()).toBe(2));
    await waitFor(() => expect(getHomeQueryCalls()).toBe(3), {
      timeout: 2000,
    });
  });

  it('polls the home query while the workflow is running', async () => {
    const { getHomeQueryCalls } = await setup({
      isRunning: true,
      refreshIntervalMs: 50,
    });
    await screen.findByText('Mock Markdown: # Home');
    await waitFor(() => expect(getHomeQueryCalls()).toBeGreaterThan(2));
  });

  it('does not poll the home query when the workflow is closed', async () => {
    const { getHomeQueryCalls } = await setup({ refreshIntervalMs: 50 });
    await screen.findByText('Mock Markdown: # Home');
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(getHomeQueryCalls()).toBe(1);
  });

  it('does not poll the home query when the interval is 0', async () => {
    const { getHomeQueryCalls } = await setup({ isRunning: true });
    await screen.findByText('Mock Markdown: # Home');
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(getHomeQueryCalls()).toBe(1);
  });
});

async function setup({
  enabled = true,
  queryTypes = [WORKFLOW_HOME_QUERY_NAME],
  queryError,
  nonMarkdown,
  homeView = 'home',
  isRunning = false,
  refreshIntervalMs = 0,
}: {
  enabled?: boolean;
  queryTypes?: string[];
  queryError?: boolean;
  nonMarkdown?: boolean;
  homeView?: 'home' | 'summary';
  isRunning?: boolean;
  refreshIntervalMs?: number;
}) {
  const user = userEvent.setup();
  let homeQueryCalls = 0;

  mockUsePageQueryParams.mockReturnValue([
    { homeView } as never,
    mockSetQueryParams,
  ]);

  render(
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowHome params={params} />
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
            return HttpResponse.json(
              configKey === 'WORKFLOW_HOME_REFRESH_INTERVAL_MS'
                ? refreshIntervalMs
                : enabled
            );
          },
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: isRunning
            ? {
                ...mockDescribeWorkflowResponse,
                workflowExecutionInfo: {
                  ...mockDescribeWorkflowResponse.workflowExecutionInfo,
                  closeStatus: null,
                  closeEvent: null,
                },
              }
            : mockDescribeWorkflowResponse,
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: { queryTypes },
        },
        {
          path: `/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query/${WORKFLOW_HOME_QUERY_NAME}`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
            homeQueryCalls++;
            if (queryError) {
              return HttpResponse.json({ message: 'nope' }, { status: 500 });
            }
            return HttpResponse.json({
              result: nonMarkdown
                ? { a: 1 }
                : {
                    cadenceResponseType: 'formattedData',
                    format: 'text/markdown',
                    data: '# Home',
                  },
              rejected: null,
            });
          },
        },
      ],
    }
  );

  return { user, getHomeQueryCalls: () => homeQueryCalls };
}
