import workflowCustomViewRefreshIntervalMs from '../workflow-custom-view-refresh-interval-ms';
import { WORKFLOW_CUSTOM_VIEW_DEFAULT_REFRESH_INTERVAL_MS } from '../workflow-custom-view-refresh-interval-ms.constants';

describe(workflowCustomViewRefreshIntervalMs.name, () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it.each([
    [undefined, WORKFLOW_CUSTOM_VIEW_DEFAULT_REFRESH_INTERVAL_MS],
    ['', WORKFLOW_CUSTOM_VIEW_DEFAULT_REFRESH_INTERVAL_MS],
    ['abc', WORKFLOW_CUSTOM_VIEW_DEFAULT_REFRESH_INTERVAL_MS],
    ['-1', WORKFLOW_CUSTOM_VIEW_DEFAULT_REFRESH_INTERVAL_MS],
    ['0', 0],
    ['10000', 10000],
  ])('returns the right interval for %p', async (envValue, expected) => {
    process.env = {
      ...originalEnv,
      CADENCE_WORKFLOW_CUSTOM_VIEW_REFRESH_INTERVAL_MS: envValue,
    };
    expect(await workflowCustomViewRefreshIntervalMs()).toBe(expected);
  });
});
