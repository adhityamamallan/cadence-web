import getCustomViewTabTitle from '../get-custom-view-tab-title';

const getResponse = (data: string) => ({
  result: {
    cadenceResponseType: 'formattedData',
    format: 'text/markdown',
    data,
  },
  rejected: null,
});

describe(getCustomViewTabTitle.name, () => {
  it('returns the frontmatter title', () => {
    expect(
      getCustomViewTabTitle(getResponse('---\ntitle: Expense 1\n---\n# Hi'))
    ).toBe('Expense 1');
  });

  it('returns undefined without data', () => {
    expect(getCustomViewTabTitle(undefined)).toBeUndefined();
  });

  it('returns undefined without frontmatter', () => {
    expect(getCustomViewTabTitle(getResponse('# Hi'))).toBeUndefined();
  });

  it('returns undefined for a rejected query', () => {
    expect(
      getCustomViewTabTitle({
        result: null,
        rejected: { closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' },
      })
    ).toBeUndefined();
  });

  it('returns undefined when the result is not markdown', () => {
    expect(
      getCustomViewTabTitle({ result: { a: 1 }, rejected: null })
    ).toBeUndefined();
  });
});
