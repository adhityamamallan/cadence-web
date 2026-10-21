import { render, screen } from '@/test-utils/rtl';

import WorkflowCustomViewEmpty from '../workflow-custom-view-empty';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <button>Copy: {textToCopy}</button>)
);

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message, description, actions }) => (
    <div>
      <h1>{message}</h1>
      <div>{description}</div>
      {actions.map((action: { label: string; link: string }) => (
        <a key={action.label} href={action.link}>
          {action.label}
        </a>
      ))}
    </div>
  ))
);

describe(WorkflowCustomViewEmpty.name, () => {
  it('renders the message', () => {
    setup();
    expect(
      screen.getByText('This workflow has no custom view.')
    ).toBeInTheDocument();
  });

  it('renders the Go snippet with a copy button', () => {
    setup();
    expect(
      screen.getByText(/Copy: workflow\.SetQueryHandler/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/workflow\.SetQueryHandler/, { selector: 'pre' })
    ).toBeInTheDocument();
  });

  it('links to the Markdoc guide', () => {
    setup();
    expect(screen.getByText('Markdoc guide')).toHaveAttribute('href', '/docs');
  });
});

function setup() {
  render(<WorkflowCustomViewEmpty />);
}
