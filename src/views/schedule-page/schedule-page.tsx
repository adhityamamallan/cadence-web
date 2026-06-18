import React from 'react';

import decodeUrlParams from '@/utils/decode-url-params';

import SchedulePageHeader from './schedule-page-header/schedule-page-header';
import {
  type Props,
  type SchedulePageLayoutParams,
} from './schedule-page.types';

export default async function SchedulePage({ params, children }: Props) {
  const decodedParams = decodeUrlParams(
    await params
  ) as SchedulePageLayoutParams;

  return (
    <>
      <SchedulePageHeader
        domain={decodedParams.domain}
        cluster={decodedParams.cluster}
        scheduleId={decodedParams.scheduleId}
      />
      {children}
    </>
  );
}
