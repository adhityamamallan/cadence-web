import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHomeHeader from '../workflow-home-header';
import { type Props } from '../workflow-home-header.types';

describe(WorkflowHomeHeader.name, () => {
  it('renders the Refresh button', () => {
    setup({});
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('calls onRefresh when Refresh is clicked', async () => {
    const { user, onRefresh } = setup({});
    await user.click(screen.getByText('Refresh'));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});

function setup(props: Partial<Props>) {
  const user = userEvent.setup();
  const onRefresh = jest.fn();
  render(
    <WorkflowHomeHeader onRefresh={onRefresh} isRefreshing={false} {...props} />
  );
  return { user, onRefresh };
}
