/**
 * Returns whether the workflow Custom view (rendered from a Markdoc query) is enabled.
 *
 * To enable, set the CADENCE_WORKFLOW_CUSTOM_VIEW_ENABLED env variable to true.
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether the workflow Custom view is enabled.
 */
export default async function workflowCustomViewEnabled(): Promise<boolean> {
  return process.env.CADENCE_WORKFLOW_CUSTOM_VIEW_ENABLED === 'true';
}
