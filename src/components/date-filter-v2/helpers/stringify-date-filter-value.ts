import dayjs from '@/utils/datetime/dayjs';

import { type DateFilterValue } from '../date-filter-v2.types';

export default function stringifyDateFilterValue(
  v: DateFilterValue,
  prettyPrint?: 'pretty'
): string {
  const now = dayjs();

  if (dayjs.isDayjs(v)) {
    return prettyPrint === 'pretty'
      ? v.format(
          v.isSame(now, 'year')
            ? 'DD MMM, HH:mm:ss z'
            : 'DD MMM YYYY, HH:mm:ss z'
        )
      : v.toISOString();
  }

  return v;
}
