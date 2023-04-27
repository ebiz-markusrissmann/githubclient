import { IWorkflowRun } from '../interfaces/responses/i-workflow-run';
import { IWorkflowRunResponse } from '../interfaces/responses/i-workflow-run-response';

export class WorkflowRunResponse implements IWorkflowRunResponse {
  total_count: number;
  workflow_runs: IWorkflowRun[];

  constructor(total_count: number, workflow_runs: IWorkflowRun[]) {
    this.total_count = total_count;
    this.workflow_runs = workflow_runs;
  }
}
