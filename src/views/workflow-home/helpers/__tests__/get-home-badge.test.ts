import getHomeBadge from '../get-home-badge';

const getResponse = (data: string) => ({
  result: {
    cadenceResponseType: 'formattedData',
    format: 'text/markdown',
    data,
  },
  rejected: null,
});

describe(getHomeBadge.name, () => {
  it('returns the frontmatter badge', () => {
    expect(
      getHomeBadge(
        getResponse('---\ntitle: Expense report 1\nbadge: Expense 1\n---\n# Hi')
      )
    ).toBe('Expense 1');
  });

  it('returns undefined without data', () => {
    expect(getHomeBadge(undefined)).toBeUndefined();
  });

  it('returns undefined when the frontmatter has only a title', () => {
    expect(
      getHomeBadge(getResponse('---\ntitle: Expense report 1\n---\n# Hi'))
    ).toBeUndefined();
  });

  it('returns undefined without frontmatter', () => {
    expect(getHomeBadge(getResponse('# Hi'))).toBeUndefined();
  });

  it('returns undefined for a rejected query', () => {
    expect(
      getHomeBadge({
        result: null,
        rejected: { closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED' },
      })
    ).toBeUndefined();
  });

  it('returns undefined when the result is not markdown', () => {
    expect(getHomeBadge({ result: { a: 1 }, rejected: null })).toBeUndefined();
  });
});
