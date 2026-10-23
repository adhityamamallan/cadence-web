'use client';
import React from 'react';

import Markdown from '@/components/markdown/markdown';

import {
  DOMAIN_MARKDOC_COMPONENTS,
  DOMAIN_MARKDOC_TAGS,
} from './domain-markdown.constants';
import { type Props } from './domain-markdown.types';

export default function DomainMarkdown(props: Props) {
  return (
    <Markdown
      markdown={props.markdown}
      domain={props.domain}
      cluster={props.cluster}
      onActionSuccess={props.onActionSuccess}
      extraTags={DOMAIN_MARKDOC_TAGS}
      extraComponents={DOMAIN_MARKDOC_COMPONENTS}
    />
  );
}
