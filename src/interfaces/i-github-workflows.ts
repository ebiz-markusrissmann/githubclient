import { components } from '@octokit/openapi-types';
import { Workflow } from '@octokit/webhooks-types';

export interface IGithubWorkflow {
  /**
   * Get all workflows of a specific repository and a specific owner
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns {workflow[]}
   */
  ListWorkflows(owner: string, repo: string): Promise<Workflow[]>;

  /**
   * Gets all infos to a specific workflow
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @returns The requested workflow, if not found undefined
   */
  GetWorkflow(owner: string, repo: string, workflow_id: number | string): Promise<Workflow | undefined>;

  /**
   *
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @param {string} branch - The name of the branch from which the code is to be taken
   * @param {string} inputs - Input keys and values configured in the workflow file. The maximum number of properties is 10. Any default properties configured in the workflow file will be used when inputs are omitted.
   */
  TriggerWorkflow(owner: string, repo: string, workflowName: string, branch: string, inputs?: any): Promise<number | undefined>;

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

  /**
   * Gets the number of billable minutes used by a specific workflow during the current billing cycle. Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners. Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage.
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param workflow_id - The ID of the workflow
   * @returns
   */
  GetWorkflowUsage(owner: string, repo: string, workflow_id: number): Promise<components['schemas']['workflow-usage']>;

  /**
   * Disables a workflow and sets the state of the workflow to disabled_manually. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param workflow_id - The ID of the workflow
   * @returns 204, if successfull
   */
  DisableWorkflow(owner: string, repo: string, workflow_id: number): Promise<number>;

  /**
   * Enables a workflow and sets the state of the workflow to active. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param workflow_id - The ID of the workflow
   * @returns
   */
  EnableWorkflow(owner: string, repo: string, workflow_id: number): Promise<number>;
}
