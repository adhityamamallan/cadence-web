'use client';
import React, { useMemo } from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import getWorkflowsErrorPanelProps from '@/views/domain-workflows/domain-workflows-table/helpers/get-workflows-error-panel-props';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import useWorkflowsListColumns from '@/views/shared/workflows-list/hooks/use-workflows-list-columns';
import WorkflowsList from '@/views/shared/workflows-list/workflows-list';

import getMarkdocWorkflowsListColumns from './helpers/get-markdoc-workflows-list-columns';
import { styled } from './markdoc-workflows-list.styles';
import { type ContentProps } from './markdoc-workflows-list.types';

export default function MarkdocWorkflowsListContent({
  query,
  pageSize,
  columns,
  domain,
  cluster,
}: ContentProps) {
  const { availableColumns } = useWorkflowsListColumns({ domain, cluster });

  const visibleColumns = useMemo(
    () => getMarkdocWorkflowsListColumns(availableColumns, columns),
    [availableColumns, columns]
  );

  const {
    workflows,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useListWorkflows({
    domain,
    cluster,
    listType: 'default',
    inputType: 'query',
    query,
    pageSize,
  });

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }

  if (workflows.length === 0) {
    const errorPanelProps = getWorkflowsErrorPanelProps({
      inputType: 'query',
      error,
      areSearchParamsAbsent: false,
    });

    if (errorPanelProps) {
      return <ErrorPanel {...errorPanelProps} reset={refetch} />;
    }
  }

  return (
    <styled.ScrollContainer>
      <WorkflowsList
        domain={domain}
        cluster={cluster}
        workflows={workflows}
        columns={visibleColumns}
        error={error}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </styled.ScrollContainer>
  );
}
