'use client';
import React from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import ErrorPanel from '@/components/error-panel/error-panel';

import {
  WORKFLOW_CUSTOM_VIEW_EMPTY_DESCRIPTION,
  WORKFLOW_CUSTOM_VIEW_GO_SNIPPET,
  WORKFLOW_CUSTOM_VIEW_MESSAGES,
} from '../workflow-custom-view.constants';

import { styled } from './workflow-custom-view-empty.styles';

export default function WorkflowCustomViewEmpty() {
  return (
    <ErrorPanel
      omitLogging
      message={WORKFLOW_CUSTOM_VIEW_MESSAGES.empty}
      description={
        <styled.Description>
          <span>{WORKFLOW_CUSTOM_VIEW_EMPTY_DESCRIPTION}</span>
          <styled.Snippet>
            <styled.Code>{WORKFLOW_CUSTOM_VIEW_GO_SNIPPET}</styled.Code>
            <styled.CopyButtonContainer>
              <CopyTextButton textToCopy={WORKFLOW_CUSTOM_VIEW_GO_SNIPPET} />
            </styled.CopyButtonContainer>
          </styled.Snippet>
        </styled.Description>
      }
      actions={[
        {
          kind: 'link-internal',
          label: 'Markdoc guide',
          link: '/docs',
          buttonKind: 'secondary',
        },
      ]}
    />
  );
}
