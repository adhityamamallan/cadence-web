import type React from 'react';

export type SchedulePageLayoutParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type Props = {
  params: Promise<SchedulePageLayoutParams>;
  children: React.ReactNode;
};
