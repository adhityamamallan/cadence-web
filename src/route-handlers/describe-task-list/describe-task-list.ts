import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type TaskList,
  type RequestParams,
  type RouteParams,
} from './describe-task-list.types';
import getWorkersForTaskList from './helpers/get-workers-for-task-list';

export async function describeTaskList(
  _: NextRequest,
  requestParams: RequestParams
) {
  const decodedParams = decodeUrlParams(requestParams.params) as RouteParams;

  try {
    const decisionTaskList = await grpcClient
      .getClusterMethods(decodedParams.cluster)
      .describeTaskList({
        domain: decodedParams.domain,
        taskList: {
          name: decodedParams.taskListName,
        },
        taskListType: 'TASK_LIST_TYPE_DECISION',
      });

    const activityTaskList = await grpcClient
      .getClusterMethods(decodedParams.cluster)
      .describeTaskList({
        domain: decodedParams.domain,
        taskList: {
          name: decodedParams.taskListName,
        },
        taskListType: 'TASK_LIST_TYPE_ACTIVITY',
      });

    const taskList: TaskList = {
      name: decodedParams.taskListName,
      workers: getWorkersForTaskList({ decisionTaskList, activityTaskList }),
      decisionTaskListStatus: decisionTaskList.taskListStatus,
      activityTaskListStatus: activityTaskList.taskListStatus,
    };

    return NextResponse.json({ taskList });
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, cause: e },
      'Error fetching task list'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error fetching task list',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}