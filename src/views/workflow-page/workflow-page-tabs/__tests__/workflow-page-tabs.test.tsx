import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, act, fireEvent, waitFor } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';
import { WORKFLOW_HOME_QUERY_NAME } from '@/views/workflow-home/workflow-home.constants';

import { mockDescribeWorkflowResponse } from '../../__fixtures__/describe-workflow-response';
import { mockWorkflowPageTabsConfig } from '../../__fixtures__/workflow-page-tabs-config';
import WorkflowPageTabs from '../workflow-page-tabs';

const mockPushFn = jest.fn();
//TODO @assem.hafez  create testing util for router
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockPushFn,
    back: () => {},
    replace: () => {},
    forward: () => {},
    prefetch: () => {},
    refresh: () => {},
  }),
  useParams: () => ({
    cluster: 'example-cluster',
    domain: 'example-domain',
    runId: 'example-runId',
    workflowId: 'example-workflowId',
    workflowTab: 'summary',
  }),
}));

jest.mock(
  '../../config/workflow-page-tabs.config',
  () => mockWorkflowPageTabsConfig
);

jest.mock(
  '../../workflow-page-cli-commands-button/workflow-page-cli-commands-button',
  () => jest.fn(() => <div>CLI Commands</div>)
);

jest.mock('@/views/workflow-actions/workflow-actions', () =>
  jest.fn(() => <div>Actions</div>)
);

describe('WorkflowPageTabs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tabs titles correctly with diagnostics disabled', async () => {
    await setup({ enableDiagnostics: false });

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Queries')).toBeInTheDocument();
    expect(screen.getByText('Stack Trace')).toBeInTheDocument();
    expect(screen.queryByText('Diagnostics')).toBeNull();
  });

  it('renders diagnostics tab when diagnostics enabled and not in history', async () => {
    await setup({
      enableDiagnostics: true,
      enableDiagnosticsInHistory: false,
    });

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Queries')).toBeInTheDocument();
    expect(screen.getByText('Stack Trace')).toBeInTheDocument();
    expect(screen.getByText('Diagnostics')).toBeInTheDocument();
  });

  it('hides diagnostics tab when diagnostics shown in history', async () => {
    await setup({
      enableDiagnostics: true,
      enableDiagnosticsInHistory: true,
    });

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Queries')).toBeInTheDocument();
    expect(screen.getByText('Stack Trace')).toBeInTheDocument();
    expect(screen.queryByText('Diagnostics')).toBeNull();
  });

  it('renders the home page tab when the feature is enabled', async () => {
    await setup({ enableHome: true });

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('home-artwork')).toBeInTheDocument();
  });

  it('hides the home page tab when the feature is disabled', async () => {
    await setup({ enableHome: false });

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.queryByText('Home')).toBeNull();
    expect(screen.queryByTestId('home-artwork')).toBeNull();
  });

  it('shows the title from the page frontmatter as the home page tab name', async () => {
    await setup({
      enableHome: true,
      homeMarkdown: '---\ntitle: Expense 1\n---\n# Hi',
    });

    expect(await screen.findByText('Expense 1')).toBeInTheDocument();
    expect(screen.queryByText('Home')).toBeNull();
  });

  it('keeps the default home page tab name without a frontmatter title', async () => {
    const { getHomeQueryCalls } = await setup({
      enableHome: true,
      homeMarkdown: '# Hi',
    });

    await waitFor(() => expect(getHomeQueryCalls()).toBe(1));
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('keeps the default home page tab name when the query fails', async () => {
    const { getHomeQueryCalls } = await setup({
      enableHome: true,
    });

    await waitFor(() => expect(getHomeQueryCalls()).toBe(1));
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('does not run the home page query when the feature is disabled', async () => {
    const { getHomeQueryCalls } = await setup({
      enableHome: false,
      homeMarkdown: '---\ntitle: Expense 1\n---\n# Hi',
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getHomeQueryCalls()).toBe(0);
  });

  it('does not run the home page query for archived workflows', async () => {
    const { getHomeQueryCalls } = await setup({
      enableHome: true,
      archived: true,
      homeMarkdown: '# Hi',
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getHomeQueryCalls()).toBe(0);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders tabs buttons correctly', async () => {
    await setup({ enableDiagnostics: false });

    expect(screen.getByText('CLI Commands')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders tabs artworks correctly with diagnostics disabled', async () => {
    await setup({ enableDiagnostics: false });

    expect(screen.getByTestId('summary-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('history-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('queries-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('stack-trace-artwork')).toBeInTheDocument();
    expect(screen.queryByTestId('diagnostics-artwork')).toBeNull();
  });

  it('renders tabs artworks correctly with diagnostics enabled and not in history', async () => {
    await setup({
      enableDiagnostics: true,
      enableDiagnosticsInHistory: false,
    });

    expect(screen.getByTestId('summary-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('history-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('queries-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('stack-trace-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('diagnostics-artwork')).toBeInTheDocument();
  });

  it('hides diagnostics artwork when diagnostics shown in history', async () => {
    await setup({
      enableDiagnostics: true,
      enableDiagnosticsInHistory: true,
    });

    expect(screen.getByTestId('summary-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('history-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('queries-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('stack-trace-artwork')).toBeInTheDocument();
    expect(screen.queryByTestId('diagnostics-artwork')).toBeNull();
  });

  it('reroutes when new tab is clicked', async () => {
    await setup({ enableDiagnostics: false });

    const historyTab = await screen.findByText('History');
    act(() => {
      fireEvent.click(historyTab);
    });

    expect(mockPushFn).toHaveBeenCalledWith('history');
  });

  it('handles errors gracefully', async () => {
    await setup({ error: true });

    expect(
      await screen.findByText('Error: Failed to fetch config')
    ).toBeInTheDocument();
  });
});

async function setup({
  error,
  enableDiagnostics,
  enableDiagnosticsInHistory,
  enableHome,
  homeMarkdown,
  archived,
}: {
  error?: boolean;
  enableDiagnostics?: boolean;
  enableDiagnosticsInHistory?: boolean;
  enableHome?: boolean;
  homeMarkdown?: string;
  archived?: boolean;
}) {
  let homeQueryCalls = 0;
  render(
    <ErrorBoundary
      fallbackRender={({ error }) => <div>Error: {error.message}</div>}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <WorkflowPageTabs />
      </Suspense>
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: {
            ...mockDescribeWorkflowResponse,
            workflowExecutionInfo: {
              ...mockDescribeWorkflowResponse.workflowExecutionInfo,
              isArchived: archived ?? false,
            },
          },
        },
        {
          path: `/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query/${WORKFLOW_HOME_QUERY_NAME}`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
            homeQueryCalls++;
            if (homeMarkdown === undefined) {
              return HttpResponse.json({ message: 'nope' }, { status: 500 });
            }
            return HttpResponse.json({
              result: {
                cadenceResponseType: 'formattedData',
                format: 'text/markdown',
                data: homeMarkdown,
              },
              rejected: null,
            });
          },
        },
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch config' },
                { status: 500 }
              );
            }

            const url = new URL(request.url);
            const configKey = url.searchParams.get('configKey');

            switch (configKey) {
              case 'WORKFLOW_DIAGNOSTICS_ENABLED':
                return HttpResponse.json(
                  (enableDiagnostics ??
                    false) satisfies GetConfigResponse<'WORKFLOW_DIAGNOSTICS_ENABLED'>
                );
              case 'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED':
                return HttpResponse.json(
                  (enableDiagnosticsInHistory ??
                    false) satisfies GetConfigResponse<'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'>
                );
              case 'WORKFLOW_HOME_ENABLED':
                return HttpResponse.json(
                  (enableHome ??
                    false) satisfies GetConfigResponse<'WORKFLOW_HOME_ENABLED'>
                );
              default:
                return HttpResponse.json(false);
            }
          },
        },
      ],
    }
  );

  if (!error) {
    // Wait for the first tab to load
    await screen.findByText('Summary');
  }

  return { getHomeQueryCalls: () => homeQueryCalls };
}
