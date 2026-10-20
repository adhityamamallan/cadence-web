import { WORKFLOW_CUSTOM_VIEW_DEFAULT_REFRESH_INTERVAL_MS } from './workflow-custom-view-refresh-interval-ms.constants';

/**
 * Returns how often (in ms) the workflow Custom view re-runs its query while the workflow is running.
 * 0 turns polling off.
 *
 * To change it, set the CADENCE_WORKFLOW_CUSTOM_VIEW_REFRESH_INTERVAL_MS env variable.
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<number>} The refresh interval in milliseconds.
 */
export default async function workflowCustomViewRefreshIntervalMs(): Promise<number> {
  const value = Number(
    process.env.CADENCE_WORKFLOW_CUSTOM_VIEW_REFRESH_INTERVAL_MS
  );
  if (
    !process.env.CADENCE_WORKFLOW_CUSTOM_VIEW_REFRESH_INTERVAL_MS ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return WORKFLOW_CUSTOM_VIEW_DEFAULT_REFRESH_INTERVAL_MS;
  }
  return value;
}
