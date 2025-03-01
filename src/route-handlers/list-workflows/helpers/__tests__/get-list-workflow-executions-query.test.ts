import getListWorkflowExecutionsQuery from '../get-list-workflow-executions-query';

describe('getListWorkflowExecutionsQuery', () => {
  it('should return query', () => {
    const query = getListWorkflowExecutionsQuery({
      search: 'mocksearchterm',
      workflowStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
      sortColumn: 'CloseTime',
      sortOrder: 'ASC',
      timeColumn: 'StartTime',
      timeRangeStart: '1712066100000000',
      timeRangeEnd: '1712096100000000',
    });
    expect(query).toEqual(
      '(WorkflowType = "mocksearchterm" OR WorkflowID = "mocksearchterm" OR RunID = "mocksearchterm") AND CloseStatus = 3 AND StartTime > "1712066100000000" AND StartTime <= "1712096100000000" ORDER BY CloseTime ASC'
    );
  });

  it('should return query for running status', () => {
    const query = getListWorkflowExecutionsQuery({
      search: 'mocksearchterm',
      timeColumn: 'StartTime',
      workflowStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    });
    expect(query).toEqual(
      '(WorkflowType = "mocksearchterm" OR WorkflowID = "mocksearchterm" OR RunID = "mocksearchterm") AND CloseTime = missing ORDER BY StartTime DESC'
    );
  });

  it('should return default query with no params except for time column', () => {
    const query = getListWorkflowExecutionsQuery({ timeColumn: 'StartTime' });
    expect(query).toEqual('ORDER BY StartTime DESC');
  });
});
