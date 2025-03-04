import React from 'react';

import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainWorkflowsBasicFilters from './domain-workflows-basic-filters/domain-workflows-basic-filters';
import DomainWorkflowsBasicTable from './domain-workflows-basic-table/domain-workflows-basic-table';

export default function DomainWorkflowsBasic(props: DomainPageTabContentProps) {
  return (
    <>
      <DomainWorkflowsBasicFilters />
      <DomainWorkflowsBasicTable
        domain={props.domain}
        cluster={props.cluster}
      />
    </>
  );
}
