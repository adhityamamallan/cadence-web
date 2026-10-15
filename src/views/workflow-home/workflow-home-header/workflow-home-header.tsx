'use client';
import React from 'react';

import { Button } from 'baseui/button';
import { MdRefresh } from 'react-icons/md';

import SegmentedControlRounded from '@/components/segmented-control-rounded/segmented-control-rounded';

import { type WorkflowHomeView } from '../workflow-home.types';

import { overrides, styled } from './workflow-home-header.styles';
import { type Props } from './workflow-home-header.types';

export default function WorkflowHomeHeader({
  activeView,
  onViewChange,
  onRefresh,
  isRefreshing,
}: Props) {
  return (
    <styled.Header>
      <SegmentedControlRounded
        activeKey={activeView}
        options={[
          { key: 'home', label: 'Home' },
          { key: 'summary', label: 'Summary' },
        ]}
        onChange={({ activeKey }) =>
          onViewChange(
            (activeKey === 'summary'
              ? 'summary'
              : 'home') satisfies WorkflowHomeView
          )
        }
      />
      {activeView === 'home' && (
        <Button
          size="compact"
          kind="secondary"
          shape="pill"
          startEnhancer={<MdRefresh size={16} />}
          isLoading={isRefreshing}
          onClick={onRefresh}
          overrides={overrides.refreshButton}
        >
          Refresh
        </Button>
      )}
    </styled.Header>
  );
}
