import { type DescribeDomainResponse } from '@/route-handlers/describe-domain/describe-domain.types';
import { type WorkflowListItem } from '@/route-handlers/list-workflows/list-workflows.types';

export type Props = {
  params: Promise<{ domain: string; cluster: string }>;
  children: React.ReactNode;
};

export type DomainDescription = DescribeDomainResponse;

export type DomainWorkflow = WorkflowListItem;
