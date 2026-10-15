'use client';
import React, { useState } from 'react';

import { Button } from 'baseui/button';

import { styled } from './workflow-home-notice.styles';
import { type Props } from './workflow-home-notice.types';

export default function WorkflowHomeNotice({ message }: Props) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <styled.Notice role="status">
      <span>{message}</span>
      <Button size="mini" onClick={() => setIsDismissed(true)}>
        Dismiss
      </Button>
    </styled.Notice>
  );
}
