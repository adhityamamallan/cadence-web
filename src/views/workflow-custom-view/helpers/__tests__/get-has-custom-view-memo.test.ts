import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import { WORKFLOW_CUSTOM_VIEW_MEMO_KEY } from '../../workflow-custom-view.constants';
import getHasCustomViewMemo from '../get-has-custom-view-memo';

describe(getHasCustomViewMemo.name, () => {
  it('returns false when there is no response', () => {
    expect(getHasCustomViewMemo(undefined)).toBe(false);
  });

  it('returns false when the memo is missing', () => {
    expect(getHasCustomViewMemo(mockDescribeWorkflowResponse)).toBe(false);
  });

  it('returns true for a JSON true memo', () => {
    expect(getHasCustomViewMemo(setup('true'))).toBe(true);
  });

  it('returns true for a JSON string "true" memo', () => {
    expect(getHasCustomViewMemo(setup('"true"'))).toBe(true);
  });

  it('returns false for a false memo', () => {
    expect(getHasCustomViewMemo(setup('false'))).toBe(false);
  });

  it('returns false for other values', () => {
    expect(getHasCustomViewMemo(setup('1'))).toBe(false);
    expect(getHasCustomViewMemo(setup('"yes"'))).toBe(false);
    expect(getHasCustomViewMemo(setup('{"a":true}'))).toBe(false);
  });
});

function setup(json: string): DescribeWorkflowResponse {
  return {
    ...mockDescribeWorkflowResponse,
    workflowExecutionInfo: {
      ...mockDescribeWorkflowResponse.workflowExecutionInfo,
      memo: {
        fields: {
          [WORKFLOW_CUSTOM_VIEW_MEMO_KEY]: {
            data: Buffer.from(json, 'utf-8').toString('base64'),
          },
        },
      },
    },
  } as DescribeWorkflowResponse;
}
