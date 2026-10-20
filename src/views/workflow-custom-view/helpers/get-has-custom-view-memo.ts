import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import formatPayload from '@/utils/data-formatters/format-payload';

import { WORKFLOW_CUSTOM_VIEW_MEMO_KEY } from '../workflow-custom-view.constants';

export default function getHasCustomViewMemo(
  workflowDetails: DescribeWorkflowResponse | undefined
): boolean {
  const payload =
    workflowDetails?.workflowExecutionInfo?.memo?.fields?.[
      WORKFLOW_CUSTOM_VIEW_MEMO_KEY
    ];
  const value = formatPayload(payload);
  return value === true || value === 'true';
}
