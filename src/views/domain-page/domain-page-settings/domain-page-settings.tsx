'use client';
import React from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toaster, ToasterContainer, PLACEMENT } from 'baseui/toast';

import { type UpdateDomainFields } from '@/route-handlers/update-domain/update-domain.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import SettingsForm from '@/views/shared/settings-form/settings-form';

import {
  domainPageSettingsFormConfig,
  domainPageSettingsFormSchema,
} from '../config/domain-page-settings-form.config';
import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import { type DomainInfo } from '../domain-page.types';

import { SETTINGS_UPDATE_TOAST_DURATION_MS } from './domain-page-settings.constants';
import { overrides, styled } from './domain-page-settings.styles';
import { type SettingsValues } from './domain-page-settings.types';

export default function DomainPageSettings(props: DomainPageTabContentProps) {
  const queryClient = useQueryClient();

  const { data: domainInfo } = useSuspenseQuery<DomainInfo>(
    {
      queryKey: ['describeDomain', props],
      queryFn: () =>
        request(`/api/domains/${props.domain}/${props.cluster}`).then((res) =>
          res.json()
        ),
    },
    queryClient
  );

  const saveSettings = useMutation<DomainInfo, RequestError, SettingsValues>(
    {
      mutationFn: (data: SettingsValues) =>
        request(`/api/domains/${props.domain}/${props.cluster}/update`, {
          method: 'POST',
          body: JSON.stringify({
            description: data.description,
            historyArchivalStatus: data.historyArchival
              ? 'ARCHIVAL_STATUS_ENABLED'
              : 'ARCHIVAL_STATUS_DISABLED',
            visibilityArchivalStatus: data.visibilityArchival
              ? 'ARCHIVAL_STATUS_ENABLED'
              : 'ARCHIVAL_STATUS_DISABLED',
            workflowExecutionRetentionPeriod: {
              seconds: data.retentionPeriodSeconds,
            },
          } satisfies UpdateDomainFields),
        }).then((res) => res.json()),
    },
    queryClient
  );

  return (
    <ToasterContainer
      placement={PLACEMENT.bottom}
      autoHideDuration={SETTINGS_UPDATE_TOAST_DURATION_MS}
      overrides={overrides.toast}
    >
      <styled.SettingsContainer>
        <SettingsForm
          data={domainInfo}
          zodSchema={domainPageSettingsFormSchema}
          formConfig={domainPageSettingsFormConfig}
          onSubmit={async (data) =>
            await saveSettings.mutateAsync(data).then(() => {
              queryClient.invalidateQueries({
                queryKey: ['describeDomain', props],
              });
              toaster.positive('Successfully updated domain settings');
            })
          }
          submitButtonText="Save settings"
          onSubmitError={(e) =>
            toaster.negative('Error updating domain settings: ' + e.message)
          }
        />
      </styled.SettingsContainer>
    </ToasterContainer>
  );
}
