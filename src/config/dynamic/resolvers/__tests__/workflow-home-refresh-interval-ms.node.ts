import workflowHomeRefreshIntervalMs from '../workflow-home-refresh-interval-ms';
import { WORKFLOW_HOME_DEFAULT_REFRESH_INTERVAL_MS } from '../workflow-home-refresh-interval-ms.constants';

describe(workflowHomeRefreshIntervalMs.name, () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it.each([
    [undefined, WORKFLOW_HOME_DEFAULT_REFRESH_INTERVAL_MS],
    ['', WORKFLOW_HOME_DEFAULT_REFRESH_INTERVAL_MS],
    ['abc', WORKFLOW_HOME_DEFAULT_REFRESH_INTERVAL_MS],
    ['-1', WORKFLOW_HOME_DEFAULT_REFRESH_INTERVAL_MS],
    ['0', 0],
    ['10000', 10000],
  ])('returns the right interval for %p', async (envValue, expected) => {
    process.env = {
      ...originalEnv,
      CADENCE_WORKFLOW_HOME_REFRESH_INTERVAL_MS: envValue,
    };
    expect(await workflowHomeRefreshIntervalMs()).toBe(expected);
  });
});
