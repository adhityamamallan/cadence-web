import getCustomViewFrontmatter from '../get-custom-view-frontmatter';

describe(getCustomViewFrontmatter.name, () => {
  it('returns the title from the frontmatter', () => {
    expect(
      getCustomViewFrontmatter('---\ntitle: Expense report 1\n---\n# Hello')
    ).toEqual({ title: 'Expense report 1' });
  });

  it('trims the title', () => {
    expect(
      getCustomViewFrontmatter('---\ntitle: "  Padded  "\n---\n# Hello')
    ).toEqual({ title: 'Padded' });
  });

  it('ignores unknown keys', () => {
    expect(
      getCustomViewFrontmatter('---\ntitle: A\nfuture: 1\n---\n# Hello')
    ).toEqual({ title: 'A' });
  });

  it('returns an empty object when there is no frontmatter', () => {
    expect(getCustomViewFrontmatter('# Hello')).toEqual({});
  });

  it('returns an empty object for an empty markdown string', () => {
    expect(getCustomViewFrontmatter('')).toEqual({});
  });

  it('returns an empty object for invalid YAML', () => {
    expect(getCustomViewFrontmatter('---\ntitle: [oops\n---\n# Hello')).toEqual(
      {}
    );
  });

  it('returns an empty object when the frontmatter is not an object', () => {
    expect(getCustomViewFrontmatter('---\n- a\n- b\n---\n# Hello')).toEqual({});
  });

  it('returns an empty object when the title is not a string', () => {
    expect(getCustomViewFrontmatter('---\ntitle: 12\n---\n# Hello')).toEqual(
      {}
    );
  });

  it('returns an empty object when the title is blank', () => {
    expect(getCustomViewFrontmatter('---\ntitle: "  "\n---\n# Hello')).toEqual(
      {}
    );
  });
});
