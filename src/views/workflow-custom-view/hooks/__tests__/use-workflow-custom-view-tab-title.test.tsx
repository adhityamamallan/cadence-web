import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import { WORKFLOW_CUSTOM_VIEW_QUERY_NAME } from '../../workflow-custom-view.constants';
import useWorkflowCustomViewTabTitle from '../use-workflow-custom-view-tab-title';

const params = { domain: 'd', cluster: 'c', workflowId: 'w', runId: 'r' };

describe(useWorkflowCustomViewTabTitle.name, () => {
  it('returns the frontmatter title', async () => {
    const { result } = setup({ markdown: '---\ntitle: Expense 1\n---\n# Hi' });
    await waitFor(() => expect(result.current).toBe('Expense 1'));
  });

  it('returns undefined without a title', async () => {
    const { result, getQueryCalls } = setup({ markdown: '# Hi' });
    await waitFor(() => expect(getQueryCalls()).toBe(1));
    expect(result.current).toBeUndefined();
  });

  it('does not run the query when the feature is disabled', async () => {
    const { result, getQueryCalls } = setup({
      enabled: false,
      markdown: '---\ntitle: Expense 1\n---\n',
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getQueryCalls()).toBe(0);
    expect(result.current).toBeUndefined();
  });

  it('does not run the query for archived workflows', async () => {
    const { result, getQueryCalls } = setup({
      archived: true,
      markdown: '---\ntitle: Expense 1\n---\n',
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getQueryCalls()).toBe(0);
    expect(result.current).toBeUndefined();
  });

  it('returns undefined when the query fails', async () => {
    const { result, getQueryCalls } = setup({});
    await waitFor(() => expect(getQueryCalls()).toBe(1));
    expect(result.current).toBeUndefined();
  });
});

function setup({
  markdown,
  enabled = true,
  archived = false,
}: {
  markdown?: string;
  enabled?: boolean;
  archived?: boolean;
}) {
  let queryCalls = 0;
  const { result } = renderHook(
    () => useWorkflowCustomViewTabTitle(params),
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
              isArchived: archived,
            },
          },
        },
        {
          path: `/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query/${WORKFLOW_CUSTOM_VIEW_QUERY_NAME}`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
            queryCalls++;
            if (markdown === undefined) {
              return HttpResponse.json({ message: 'nope' }, { status: 500 });
            }
            return HttpResponse.json({
              result: {
                cadenceResponseType: 'formattedData',
                format: 'text/markdown',
                data: markdown,
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
            const configKey = new URL(request.url).searchParams.get(
              'configKey'
            );
            return HttpResponse.json(
              configKey === 'WORKFLOW_CUSTOM_VIEW_ENABLED' ? enabled : false
            );
          },
        },
      ],
    },
    {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Suspense fallback={null}>{children}</Suspense>
      ),
    }
  );
  return { result, getQueryCalls: () => queryCalls };
}
