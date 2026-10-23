import { styled as createStyled } from 'baseui';

export const styled = {
  // Long lists scroll inside the page; the next page loads at the bottom
  ScrollContainer: createStyled('div', {
    maxHeight: '50vh',
    overflowY: 'auto',
  }),
};
