import merge from 'lodash/merge';
import { NextResponse, type NextRequest } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type DescribeUnArchivedWorkflowResponse,
  type DescribeArchivedWorkflowResponse,
  type RequestParams,
  type Context,
} from './describe-workflow.types';

export default async function describeWorkflow(
  _: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const decodedParams = decodeUrlParams(requestParams.params);

  try {
    const describeWorkflowResponse =
      await ctx.grpcClusterMethods.describeWorkflow({
        domain: decodedParams.domain,
        workflowExecution: {
          workflowId: decodedParams.workflowId,
          runId: decodedParams.runId,
        },
      });

    const res: DescribeUnArchivedWorkflowResponse = merge(
      {},
      describeWorkflowResponse,
      {
        workflowExecutionInfo: { closeEvent: null, isArchived: false as const },
      }
    );
    if (
      res.workflowExecutionInfo &&
      res.workflowExecutionInfo.closeStatus &&
      res.workflowExecutionInfo.closeStatus !==
        'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
    ) {
      const closeEventResponse = await ctx.grpcClusterMethods.getHistory({
        domain: decodedParams.domain,
        workflowExecution: {
          workflowId: decodedParams.workflowId,
          runId: decodedParams.runId,
        },
        historyEventFilterType: 'EVENT_FILTER_TYPE_CLOSE_EVENT',
      });
      if (closeEventResponse.history?.events?.[0])
        res.workflowExecutionInfo.closeEvent =
          closeEventResponse.history?.events?.[0];
    }

    return NextResponse.json(res);
  } catch (e) {
    // DescribeWorkflow depends on a temp datasource, so sometimes data is not available
    // to make it more reliable we depend on history to construct similar response in case data is not available
    try {
      if (e instanceof GRPCError && e.httpStatusCode !== 404) {
        throw e;
      }
      const archivedHistoryResponse = await ctx.grpcClusterMethods.getHistory({
        domain: decodedParams.domain,
        workflowExecution: {
          workflowId: decodedParams.workflowId,
          runId: decodedParams.runId,
        },
        pageSize: 1,
      });
      const archivedHistoryEvents =
        archivedHistoryResponse.history?.events || [];

      if (!archivedHistoryEvents[0]?.workflowExecutionStartedEventAttributes) {
        throw e;
      }

      const {
        eventTime: startTime,
        workflowExecutionStartedEventAttributes: {
          taskList,
          executionStartToCloseTimeout,
          taskStartToCloseTimeout,
          workflowType: type,
        },
      } = archivedHistoryEvents[0];

      const res: DescribeArchivedWorkflowResponse = {
        executionConfiguration: {
          taskList,
          executionStartToCloseTimeout,
          taskStartToCloseTimeout,
        },
        workflowExecutionInfo: {
          workflowExecution: {
            runId: decodedParams.runId,
            workflowId: decodedParams.workflowId,
          },
          isArchived: true,
          startTime,
          type,
          closeTime: null,
          closeStatus: null,
          closeEvent: null,
          historyLength: null,
          parentExecutionInfo: null,
          executionTime: null,
          memo: null,
          searchAttributes: null,
          autoResetPoints: null,
          taskList: '',
          isCron: null,
          updateTime: null,
          partitionConfig: null,
        },
        pendingActivities: [],
        pendingChildren: [],
        pendingDecision: null,
      };
      return NextResponse.json(res);
    } catch (e) {
      // skips logs for NotFound errors
      // treat 400 responses for requesting unconfigured archives as 404
      if (
        e instanceof GRPCError &&
        (e.httpStatusCode === 404 ||
          (e.httpStatusCode === 400 &&
            e.message ===
              'Requested workflow history not found, may have passed retention period.'))
      ) {
        return NextResponse.json(
          {
            message: 'Requested workflow history not found',
            cause: e,
          },
          { status: 404 }
        );
      } else {
        logger.error<RouteHandlerErrorPayload>(
          { requestParams: decodedParams, error: e },
          'Error fetching workflow execution info'
        );

        return NextResponse.json(
          {
            message:
              e instanceof GRPCError
                ? e.message
                : 'Error fetching workflow execution info',
            cause: e,
          },
          { status: getHTTPStatusCode(e) }
        );
      }
    }
  }
}
