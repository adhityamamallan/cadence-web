import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskScheduledEvent } from './format-workflow-history-event.type';

const formatDecisionTaskScheduledEvent = ({
  decisionTaskScheduledEventAttributes: {
    startToCloseTimeout,
    taskList,
    ...eventAttributes
  },
  ...eventFields
}: DecisionTaskScheduledEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
    startToCloseTimeoutSeconds: formatDurationToSeconds(startToCloseTimeout),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatDecisionTaskScheduledEvent;
