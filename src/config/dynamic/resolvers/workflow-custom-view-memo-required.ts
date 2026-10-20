/**
 * Returns whether the workflow Custom view tab requires the workflow memo to be set.
 *
 * To require it, set the CADENCE_WORKFLOW_CUSTOM_VIEW_MEMO_REQUIRED env variable to true.
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether the memo is required to show the Custom view.
 */
export default async function workflowCustomViewMemoRequired(): Promise<boolean> {
  return process.env.CADENCE_WORKFLOW_CUSTOM_VIEW_MEMO_REQUIRED === 'true';
}
