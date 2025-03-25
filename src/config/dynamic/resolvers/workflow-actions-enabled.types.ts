import { type WorkflowActionID } from '@/views/workflow-actions/workflow-actions.types';

import type WORKFLOW_ACTIONS_DISABLED_VALUES_CONFIG from './workflow-actions-disabled-values.config';

export type WorkflowActionsEnabledResolverParams = {
  domain: string;
  cluster: string;
};

export type WorkflowActionDisabledValue =
  (typeof WORKFLOW_ACTIONS_DISABLED_VALUES_CONFIG)[number];

export type WorkflowActionEnabledConfigValue =
  | 'ENABLED'
  | WorkflowActionDisabledValue;

export type WorkflowActionsEnabledConfig = Record<
  WorkflowActionID,
  WorkflowActionEnabledConfigValue
>;
