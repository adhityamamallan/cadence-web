import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Notice: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: $theme.sizing.scale600,
      marginTop: $theme.sizing.scale600,
      padding: `${$theme.sizing.scale400} ${$theme.sizing.scale500}`,
      backgroundColor: $theme.colors.backgroundWarningLight,
      borderRadius: $theme.borders.radius400,
    })
  ),
};
