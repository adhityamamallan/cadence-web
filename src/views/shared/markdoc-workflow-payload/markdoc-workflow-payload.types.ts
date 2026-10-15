export type WorkflowPayloadKind = 'input' | 'result';

export type TagProps = {
  workflowId?: string;
  runId?: string;
  domain?: string;
  cluster?: string;
  path?: string;
};

export type Props = TagProps & {
  kind: WorkflowPayloadKind;
};

export type ContentProps = {
  kind: WorkflowPayloadKind;
  workflowId: string;
  runId: string;
  domain: string;
  cluster: string;
  path?: string;
};
