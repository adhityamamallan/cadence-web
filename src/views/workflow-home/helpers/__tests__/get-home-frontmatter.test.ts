import getHomeFrontmatter from '../get-home-frontmatter';

describe(getHomeFrontmatter.name, () => {
  it('returns the title from the frontmatter', () => {
    expect(
      getHomeFrontmatter('---\ntitle: Expense report 1\n---\n# Hello')
    ).toEqual({ title: 'Expense report 1' });
  });

  it('trims the title', () => {
    expect(
      getHomeFrontmatter('---\ntitle: "  Padded  "\n---\n# Hello')
    ).toEqual({ title: 'Padded' });
  });

  it('ignores unknown keys', () => {
    expect(
      getHomeFrontmatter('---\ntitle: A\nfuture: 1\n---\n# Hello')
    ).toEqual({ title: 'A' });
  });

  it('returns an empty object when there is no frontmatter', () => {
    expect(getHomeFrontmatter('# Hello')).toEqual({});
  });

  it('returns an empty object for an empty markdown string', () => {
    expect(getHomeFrontmatter('')).toEqual({});
  });

  it('returns an empty object for invalid YAML', () => {
    expect(getHomeFrontmatter('---\ntitle: [oops\n---\n# Hello')).toEqual({});
  });

  it('returns an empty object when the frontmatter is not an object', () => {
    expect(getHomeFrontmatter('---\n- a\n- b\n---\n# Hello')).toEqual({});
  });

  it('returns an empty object when the title is not a string', () => {
    expect(getHomeFrontmatter('---\ntitle: 12\n---\n# Hello')).toEqual({});
  });

  it('returns an empty object when the title is blank', () => {
    expect(getHomeFrontmatter('---\ntitle: "  "\n---\n# Hello')).toEqual({});
  });
});
