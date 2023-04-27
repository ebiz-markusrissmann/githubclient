import { IWorkflowRun } from './i-workflow-run';

export interface IWorkflowRunResponse {
  total_count: number;
  workflow_runs: IWorkflowRun[];
}
