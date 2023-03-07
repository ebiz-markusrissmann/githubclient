import { components } from '@octokit/openapi-types';

export interface IGithubWorkflow {
  /**
   * Get all workflows of a specific repository and a specific owner
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns {workflow[]}
   */
  ListWorkflows(owner: string, repo: string): Promise<components['schemas']['workflow'][]>;

  /**
   * Gets all infos to a specific workflow
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @returns The requested workflow, if not found undefined
   */
  GetWorkflow(owner: string, repo: string, workflowName: string): Promise<components['schemas']['workflow'] | undefined>;

  /**
   *
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @param {string} branch - The name of the branch from which the code is to be taken
   * @param {string} inputs - Input keys and values configured in the workflow file. The maximum number of properties is 10. Any default properties configured in the workflow file will be used when inputs are omitted.
   */
  TriggerWorkflow(owner: string, repo: string, workflowName: string, branch: string, inputs?: any): Promise<void>;

  /**
   *
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   */
  ListWorkflowRuns(owner: string, repo: string): Promise<components['schemas']['workflow-run'][]>;

  /**
   *
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {number} run_id - The unique identifier of the workflow run
   */
  GetWorkflowRun(owner: string, repo: string, run_id: number): Promise<components['schemas']['workflow-run']>;

  /**
   * Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {number} run_id - The unique identifier of the workflow run
   */
  DownloadWorkflowRunLogs(owner: string, repo: string, run_id: number): Promise<string | undefined>;
}