import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Header: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: $theme.sizing.scale600,
      paddingTop: $theme.sizing.scale600,
    })
  ),
};

export const overrides = {
  refreshButton: {
    BaseButton: {
      style: { flexShrink: 0 },
    },
  } satisfies ButtonOverrides,
};
