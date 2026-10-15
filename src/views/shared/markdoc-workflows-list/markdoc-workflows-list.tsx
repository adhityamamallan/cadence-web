'use client';
import React, { useContext } from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import { MarkdownContext } from '@/components/markdown/markdown-context-provider/markdown-context-provider';

import MarkdocWorkflowsListContent from './markdoc-workflows-list-content';
import { MARKDOC_WORKFLOWS_LIST_DEFAULT_PAGE_SIZE } from './markdoc-workflows-list.constants';
import { type Props } from './markdoc-workflows-list.types';

export default function MarkdocWorkflowsList({
  query,
  pageSize = MARKDOC_WORKFLOWS_LIST_DEFAULT_PAGE_SIZE,
  columns,
  domain: domainProp,
  cluster: clusterProp,
}: Props) {
  const markdownContext = useContext(MarkdownContext);
  const domain = domainProp ?? markdownContext.domain;
  const cluster = clusterProp ?? markdownContext.cluster;

  if (!query || !domain || !cluster) {
    return (
      <ErrorPanel
        message="Workflows list needs a query, domain and cluster"
        omitLogging
      />
    );
  }

  return (
    <MarkdocWorkflowsListContent
      query={query}
      pageSize={pageSize}
      columns={columns}
      domain={domain}
      cluster={cluster}
    />
  );
}
