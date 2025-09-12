import { type WorkflowSignaledHistoryEvent } from '../workflow-history.types';

export const workflowExecutionSignaledEvent = {
  eventId: '2',
  eventTime: {
    seconds: '1724747415',
    nanos: 549377718,
  },
  version: '575102',
  taskId: '22647173801',
  workflowExecutionSignaledEventAttributes: {
    signalName: 'signal-name',
    input: {
      data: 'ImNhZGVuY2Uuc2lnbmFsIg==',
    },
    identity: 'cadence-service',
    requestId: '488cd24f-37b0-48f7-955a-c5c8c7653290',
  },
  attributes: 'workflowExecutionSignaledEventAttributes',
} as const satisfies WorkflowSignaledHistoryEvent;
