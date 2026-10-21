'use client';
import { createContext, useCallback, useMemo, useState } from 'react';

import {
  type FieldMeta,
  type MarkdownContextType,
  type Props,
} from './markdown-context-provider.types';

export const MarkdownContext = createContext<MarkdownContextType>({});

export default function MarkdownContextProvider({
  domain,
  cluster,
  workflowId,
  runId,
  onActionSuccess,
  children,
}: Props) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [fieldMeta, setFieldMeta] = useState<Record<string, FieldMeta>>({});

  const setFieldValue = useCallback((name: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const registerField = useCallback(
    (name: string, meta: FieldMeta, defaultValue?: string) => {
      setFieldMeta((prev) => {
        const current = prev[name];
        if (
          current &&
          current.type === meta.type &&
          current.required === meta.required
        ) {
          return prev;
        }
        return { ...prev, [name]: meta };
      });
      // Keep a value the user already typed, even if the field remounts.
      if (defaultValue !== undefined) {
        setFieldValues((prev) =>
          name in prev ? prev : { ...prev, [name]: defaultValue }
        );
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      domain,
      cluster,
      workflowId,
      runId,
      onActionSuccess,
      fieldValues,
      fieldMeta,
      setFieldValue,
      registerField,
    }),
    [
      domain,
      cluster,
      workflowId,
      runId,
      onActionSuccess,
      fieldValues,
      fieldMeta,
      setFieldValue,
      registerField,
    ]
  );

  return (
    <MarkdownContext.Provider value={contextValue}>
      {children}
    </MarkdownContext.Provider>
  );
}
