import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowCustomViewHeader from '../workflow-custom-view-header';
import { type Props } from '../workflow-custom-view-header.types';

describe(WorkflowCustomViewHeader.name, () => {
  it('renders the title as a heading when set', () => {
    setup({ title: 'Expense report 1' });
    expect(
      screen.getByRole('heading', { level: 2, name: 'Expense report 1' })
    ).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('renders no heading when there is no title', () => {
    setup({});
    expect(screen.queryByRole('heading')).toBeNull();
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
    <WorkflowCustomViewHeader
      onRefresh={onRefresh}
      isRefreshing={false}
      {...props}
    />
  );
  return { user, onRefresh };
}
