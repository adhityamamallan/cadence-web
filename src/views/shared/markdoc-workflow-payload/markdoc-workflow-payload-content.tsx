'use client';
import React, { useMemo } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import ErrorPanel from '@/components/error-panel/error-panel';
import PrettyJson from '@/components/pretty-json/pretty-json';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import losslessJsonStringify from '@/utils/lossless-json-stringify';
import useWorkflowInputResult from '@/views/shared/hooks/use-workflow-input-result';

import getWorkflowPayloadValue from './helpers/get-workflow-payload-value';
import { MARKDOC_WORKFLOW_PAYLOAD_PLACEHOLDERS as PLACEHOLDERS } from './markdoc-workflow-payload.constants';
import { overrides, styled } from './markdoc-workflow-payload.styles';
import { type ContentProps } from './markdoc-workflow-payload.types';

export default function MarkdocWorkflowPayloadContent({
  kind,
  path,
  ...workflowParams
}: ContentProps) {
  const { input, result, isRunning, isArchived, isLoading, error } =
    useWorkflowInputResult(workflowParams);

  const value = useMemo(
    () => getWorkflowPayloadValue(kind === 'input' ? input : result, path),
    [kind, input, result, path]
  );

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }

  if (error) {
    return (
      <ErrorPanel
        message="Failed to load workflow data"
        error={error}
        omitLogging
      />
    );
  }

  if (kind === 'result' && isArchived) {
    return <styled.Placeholder>{PLACEHOLDERS.archived}</styled.Placeholder>;
  }

  if (kind === 'result' && isRunning) {
    return <styled.Placeholder>{PLACEHOLDERS.running}</styled.Placeholder>;
  }

  if (value === undefined) {
    return <styled.Placeholder>{PLACEHOLDERS.noValue}</styled.Placeholder>;
  }

  if (value !== null && typeof value === 'object') {
    return (
      <styled.Container>
        <PrettyJson json={value} />
        <CopyTextButton
          textToCopy={losslessJsonStringify(value, null, '\t')}
          overrides={overrides.copyButton}
        />
      </styled.Container>
    );
  }

  return <styled.Text>{String(value)}</styled.Text>;
}
