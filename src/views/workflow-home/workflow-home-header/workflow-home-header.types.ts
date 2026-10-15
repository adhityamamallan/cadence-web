import { type WorkflowHomeView } from '../workflow-home.types';

export type Props = {
  activeView: WorkflowHomeView;
  onViewChange: (view: WorkflowHomeView) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};
