import { render, screen } from '@/test-utils/rtl';

import useWorkflowInputResult from '../../hooks/use-workflow-input-result';
import MarkdocWorkflowPayloadContent from '../markdoc-workflow-payload-content';
import { type ContentProps } from '../markdoc-workflow-payload.types';

jest.mock('../../hooks/use-workflow-input-result');
const mockHook = useWorkflowInputResult as jest.MockedFunction<
  typeof useWorkflowInputResult
>;

jest.mock('@/components/pretty-json/pretty-json', () =>
  jest.fn(({ json }) => <div>Mock JSON: {JSON.stringify(json)}</div>)
);

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

const baseState = {
  input: [{ order: { id: 7, items: ['a', 'b'] } }] as never,
  result: 'done' as never,
  isRunning: false,
  isArchived: false,
  isLoading: false,
  error: null,
};

describe(MarkdocWorkflowPayloadContent.name, () => {
  it('renders object input as JSON', () => {
    setup({ kind: 'input' });
    expect(screen.getByText(/Mock JSON:/)).toBeInTheDocument();
  });

  it('renders a scalar result as plain text', () => {
    setup({ kind: 'result' });
    expect(screen.getByText('done')).toBeInTheDocument();
  });

  it('applies the path to the payload', () => {
    mockHook.mockReturnValue({
      ...baseState,
      input: { order: { id: 7 } } as never,
    });
    render(
      <MarkdocWorkflowPayloadContent {...props} kind="input" path="order.id" />
    );
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('shows a placeholder when the path has no value', () => {
    mockHook.mockReturnValue({ ...baseState, input: { a: 1 } as never });
    render(<MarkdocWorkflowPayloadContent {...props} kind="input" path="b" />);
    expect(screen.getByText('No value')).toBeInTheDocument();
  });

  it('shows that a running workflow has no result yet', () => {
    setup({ kind: 'result', state: { isRunning: true } });
    expect(screen.getByText('Workflow is still running')).toBeInTheDocument();
  });

  it('shows that the result of an archived workflow is in history', () => {
    setup({ kind: 'result', state: { isArchived: true } });
    expect(screen.getByText(/archived/)).toBeInTheDocument();
  });

  it('shows an error message when loading fails', () => {
    setup({
      kind: 'input',
      state: { error: new Error('x') as never },
    });
    expect(
      screen.getByText('Failed to load workflow data')
    ).toBeInTheDocument();
  });
});

const props = {
  domain: 'd',
  cluster: 'c',
  workflowId: 'w',
  runId: 'r',
};

function setup({
  kind,
  state,
}: {
  kind: ContentProps['kind'];
  state?: Partial<ReturnType<typeof useWorkflowInputResult>>;
}) {
  mockHook.mockReturnValue({ ...baseState, ...state });
  render(<MarkdocWorkflowPayloadContent {...props} kind={kind} />);
}
