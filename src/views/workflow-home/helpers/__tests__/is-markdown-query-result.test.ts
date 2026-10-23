import isMarkdownQueryResult from '../is-markdown-query-result';

describe(isMarkdownQueryResult.name, () => {
  it('returns true for a markdown formattedData result', () => {
    expect(
      isMarkdownQueryResult({
        cadenceResponseType: 'formattedData',
        format: 'text/markdown',
        data: '# Hi',
      })
    ).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a string', 'text'],
    [
      'another format',
      { cadenceResponseType: 'formattedData', format: 'text/plain', data: 'x' },
    ],
    [
      'another response type',
      { cadenceResponseType: 'other', format: 'text/markdown', data: 'x' },
    ],
    [
      'non-string data',
      {
        cadenceResponseType: 'formattedData',
        format: 'text/markdown',
        data: 1,
      },
    ],
  ])('returns false for %s', (_, value) => {
    expect(isMarkdownQueryResult(value)).toBe(false);
  });
});
