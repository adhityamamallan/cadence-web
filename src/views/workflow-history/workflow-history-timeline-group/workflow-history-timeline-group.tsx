'use client';
import React from 'react';

import { Badge } from 'baseui/badge';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryEventsCard from '../workflow-history-events-card/workflow-history-events-card';

import {
  cssStyles,
  overrides,
  styled,
} from './workflow-history-timeline-group.styles';
import { type Props } from './workflow-history-timeline-group.types';

export default function WorkflowHistoryTimelineGroup({
  status,
  label,
  timeLabel,
  events,
  isLastEvent,
  eventsMetadata,
  hasMissingEvents,
  decodedPageUrlParams,
  badges,
  getIsEventExpanded,
  onEventToggle,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const hasBadges = badges !== undefined && badges.length > 0;
  return (
    <div className={cls.groupContainer}>
      <div className={cls.timelineEventHeader}>
        <WorkflowHistoryEventStatusBadge
          status={status}
          statusReady={!hasMissingEvents}
          size="medium"
        />
        <div className={cls.timelineEventLabelAndTime}>
          <div className={cls.timelineEventsLabel}>{label}</div>
          {hasBadges && (
            <div>
              {badges.map((badge) => (
                <Badge
                  key={badge.content}
                  overrides={overrides.headerBadge}
                  content={badge.content}
                  shape="rectangle"
                  color="primary"
                />
              ))}
            </div>
          )}
          <div suppressHydrationWarning className={cls.timelineEventsTime}>
            {timeLabel}
          </div>
        </div>
      </div>
      <div className={cls.timelineEventCardContainer}>
        <styled.VerticalDivider $hidden={isLastEvent} />
        <WorkflowHistoryEventsCard
          events={events}
          eventsMetadata={eventsMetadata}
          showEventPlaceholder={hasMissingEvents}
          decodedPageUrlParams={decodedPageUrlParams}
          getIsEventExpanded={getIsEventExpanded}
          onEventToggle={onEventToggle}
        />
      </div>
    </div>
  );
}
