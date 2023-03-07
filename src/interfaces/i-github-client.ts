import { components } from '@octokit/openapi-types';

export interface IGithubActionsClient {
  /**
   * Lists the workflows in a repository
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns
   */
  ListWorkflows(owner: string, repo: string): Promise<components['schemas']['workflow'][]>;

  /**
   * Gets a specific workflow.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @returns The requested workflow, if not found undefined
   */
  GetWorkflow(owner: string, repo: string, workflowName: string): Promise<components['schemas']['workflow'] | undefined>;

  /**
   * You can use this method to manually trigger a GitHub Actions workflow run.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @param {string} branch - The name of the branch from which the code is to be taken
   */
  TriggerWorkflow(owner: string, repo: string, workflowName: string, branch: string): Promise<void>;

  /**
   * Lists all repository variables.
   */
  ListRepositoryVariables(): Promise<components['schemas']['actions-variable'][]>;

  /**
   * Creates a repository variable that you can reference in a GitHub Actions workflow
   * @param {string} variableName - The name of the variable to be created
   * @param {string} value - The value of the created variable
   * @returns 201, if created
   */
  CreateRepositoryVariable(variableName: string, value: string): Promise<number>;

  /**
   * Returns a specific repository variable
   * @param {string} variableName - The name of the variable to be gathered
   * @returns The environment variable
   */
  GetRepositoryVariable(variableName: string): Promise<components['schemas']['actions-variable']>;

  /**
   * Checks if a specific repository variable exists
   * @param {string} variableName - The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  RepositoryVariableExists(variableName: string): Promise<boolean>;

  /**
   * Updates a specific repository variable
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns
   */
  UpdateRepositoryVariable(variableName: string, value: string): Promise<number>;

  /**
   * Creates or updates a specific repository variable
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns 201 if successfull created, otherwise 204 if updated
   */
  CreateOrUpdateRepositoryVariable(variableName: string, value: string): Promise<number>;

  /**
   *  Delete a specific repository variable
   * @param {string} variableName - The name of the variable to be gathered
   * @returns 204 if deleted
   */
  DeleteRepositoryVariable(variableName: string): Promise<number>;

  /**
   * List all repository secrets
   * @returns A list of all secrets
   */
  ListRepositorySecrets(): Promise<components['schemas']['actions-secret'][]>;

  /**
   *  Gets a repository secret, but no value!
   * @param {string} secretName - The name of the secret
   * @returns The secret itself without value
   */
  GetRepositorySecret(secretName: string): Promise<components['schemas']['actions-secret'] | undefined>;

  /**
   * Create or update a repository secret
   * @param {string} secretName - The name of the secret
   * @param {string} secretValue - The plan text value of the secret
   * @returns 204, if successful
   */
  CreateOrUpdateSecret(secretName: string, secretValue: string): Promise<number>;

  /**
   * Deletes a repository secret
   * @param {string} secretName - The name of the secret
   * @returns 204, if successful
   */
  DeleteRepositorySecret(secretName: string): Promise<number>;

  /**
   * Lists all workflow runs for a repository.
   */
  ListWorkflowRuns(): Promise<components['schemas']['workflow-run'][]>;

  /**
   * Gets a specific workflow run
   * @param run_id - The unique identifier of the workflow run.
   * @returns
   */
  GetWorkflowRun(run_id: number): Promise<components['schemas']['workflow-run']>;

  /**
   * Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute.
   * @param {number} run_id - The unique identifier of the workflow run
   * @returns
   */
  DownloadWorkflowRunLogs(run_id: number): Promise<string | undefined>;

  /**
   * Gets the number of billable minutes used by a specific workflow during the current billing cycle.
   * Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners.
   * Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage.
   * @param workflow_id - The ID of the workflow
   * @returns
   */
  GetWorkflowUsage(workflow_id: number): Promise<components['schemas']['workflow-usage']>;

  /**
   * Disables a workflow and sets the state of the workflow to disabled_manually. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.
   * @param workflow_id - The ID of the workflow
   * @returns 204 indicates success
   */
  DisableWorkflow(workflow_id: number): Promise<number>;

  /**
   * Enables a workflow and sets the state of the workflow to active. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.
   * @param workflow_id - The ID of the workflow
   * @returns 204 indicates success
   */
  EnableWorkflow(workflow_id: number): Promise<number>;
}
