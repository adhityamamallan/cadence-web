import getHomeTabTitle from '../get-home-tab-title';

const getResponse = (data: string) => ({
  result: {
    cadenceResponseType: 'formattedData',
    format: 'text/markdown',
    data,
  },
  rejected: null,
});

describe(getHomeTabTitle.name, () => {
  it('returns the frontmatter title', () => {
    expect(
      getHomeTabTitle(getResponse('---\ntitle: Expense 1\n---\n# Hi'))
    ).toBe('Expense 1');
  });

  it('returns undefined without data', () => {
    expect(getHomeTabTitle(undefined)).toBeUndefined();
  });

  it('returns undefined without frontmatter', () => {
    expect(getHomeTabTitle(getResponse('# Hi'))).toBeUndefined();
  });

  it('returns undefined for a rejected query', () => {
    expect(
      getHomeTabTitle({
        result: null,
        rejected: { closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' },
      })
    ).toBeUndefined();
  });

  it('returns undefined when the result is not markdown', () => {
    expect(
      getHomeTabTitle({ result: { a: 1 }, rejected: null })
    ).toBeUndefined();
  });
});
