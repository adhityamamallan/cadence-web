'use client';
import React from 'react';

import { Button } from 'baseui/button';
import { MdRefresh } from 'react-icons/md';

import { overrides, styled } from './workflow-custom-view-header.styles';
import { type Props } from './workflow-custom-view-header.types';

export default function WorkflowCustomViewHeader({
  onRefresh,
  isRefreshing,
}: Props) {
  return (
    <styled.Header>
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
    </styled.Header>
  );
}
