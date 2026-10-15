import {
  type PageQueryParam,
  type PageQueryParamMultiValue,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import { HISTORY_EVENT_FILTER_STATUSES } from '@/views/workflow-history/workflow-history-filters-status/workflow-history-filters-status.constants';
import { type HistoryEventFilterStatus } from '@/views/workflow-history/workflow-history-filters-status/workflow-history-filters-status.types';
import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.constants';
import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';
import { type WorkflowHomeView } from '@/views/workflow-home/workflow-home.types';

const workflowPageQueryParamsConfig: [
  PageQueryParamMultiValue<
    'historyEventTypes',
    WorkflowHistoryEventFilteringType[] | undefined
  >,
  PageQueryParamMultiValue<
    'historyEventStatuses',
    HistoryEventFilterStatus[] | undefined
  >,
  PageQueryParam<'historySelectedEventId', string | undefined>,
  PageQueryParam<'ungroupedHistoryViewEnabled', boolean | undefined>,
  PageQueryParam<'historyEventIssues', boolean>,
  PageQueryParam<'selectedQueryName', string | undefined>,
  PageQueryParam<'homeView', WorkflowHomeView>,
] = [
  {
    key: 'historyEventTypes',
    queryParamKey: 'ht',
    isMultiValue: true,
    parseValue: (v) => {
      if (
        v.every((t) =>
          WORKFLOW_HISTORY_EVENT_FILTERING_TYPES.includes(
            t as WorkflowHistoryEventFilteringType
          )
        )
      ) {
        return v as WorkflowHistoryEventFilteringType[];
      }
      return undefined;
    },
  },
  {
    key: 'historyEventStatuses',
    queryParamKey: 'hs',
    isMultiValue: true,
    parseValue: (v) => {
      if (v.every((s) => s in HISTORY_EVENT_FILTER_STATUSES)) {
        return v as HistoryEventFilterStatus[];
      }
      return undefined;
    },
  },
  {
    key: 'historySelectedEventId',
    queryParamKey: 'he',
  },
  {
    key: 'ungroupedHistoryViewEnabled',
    queryParamKey: 'u',
    parseValue: (v) => {
      if (v === 'true') return true;
      if (v === 'false') return false;
      return undefined;
    },
  },
  {
    key: 'historyEventIssues',
    queryParamKey: 'hdi',
    defaultValue: false,
    parseValue: (v) => v === 'true',
  },
  {
    key: 'selectedQueryName',
    queryParamKey: 'q',
  },
  {
    key: 'homeView',
    queryParamKey: 'hv',
    defaultValue: 'home',
    parseValue: (v) => (v === 'summary' ? 'summary' : 'home'),
  },
] as const;

export default workflowPageQueryParamsConfig;
