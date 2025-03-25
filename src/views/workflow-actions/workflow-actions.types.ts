import { type ReactNode } from 'react';

import { type IconProps } from 'baseui/icon';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

import type WORKFLOW_ACTIONS_NON_RUNNABLE_STATUSES_CONFIG from './config/workflow-actions-non-runnable-statuses.config';

export type WorkflowActionInputParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  // TODO: add input here for extended workflow actions
};

export type WorkflowActionID = 'cancel' | 'terminate' | 'restart';

export type WorkflowActionSuccessMessageProps<R> = {
  result: R;
  inputParams: WorkflowActionInputParams;
};

export type WorkflowActionNonRunnableStatus =
  (typeof WORKFLOW_ACTIONS_NON_RUNNABLE_STATUSES_CONFIG)[number];

export type WorkflowActionRunnableStatus =
  | 'RUNNABLE'
  | WorkflowActionNonRunnableStatus;

export type WorkflowAction<R> = {
  id: WorkflowActionID;
  label: string;
  subtitle: string;
  modal: {
    text: string | string[];
    docsLink?: {
      text: string;
      href: string;
    };
  };
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
  getRunnableStatus: (
    workflow: DescribeWorkflowResponse
  ) => WorkflowActionRunnableStatus;
  apiRoute: string;
  renderSuccessMessage: (
    props: WorkflowActionSuccessMessageProps<R>
  ) => ReactNode;
};
