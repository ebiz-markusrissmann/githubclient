import { components } from '@octokit/openapi-types/types';
import { Workflow } from '@octokit/webhooks-types';
import { Octokit } from 'octokit';
import { WorkflowRun } from './data/workflow-run';
import { GithubSecrets } from './github-secrets';
import { GithubVariables } from './github-variables';
import { GithubWorkflow } from './github-workflow';
import { IGithubActionsClient } from './interfaces/i-github-client';
import { IGithubVariables } from './interfaces/i-github-variables';
import { IGithubWorkflow } from './interfaces/i-github-workflows';
import { IActionsVariable } from './interfaces/responses/i-actions-variable';
import { ErrorHandler } from './tools-utils/error-handler';

export class GithubActionsClient implements IGithubActionsClient {
  public octokitClient: Octokit;
  githubWorkFlow: IGithubWorkflow;
  githubVariables: IGithubVariables;
  githubSecrets: GithubSecrets;
  github_username: string;
  github_repository: string;
  github_apiVersion: string;
  errorHandler: ErrorHandler;

  /**
   *
   * @param github_username  the github user that performs the actions
   * @param github_repository  the repository to perform a action
   * @param githubToken  the github token to be used, otherwise process.env.GITHUB_TOKEN is taken
   * @param apiVersion  the guithub api verion, e.g. 2022-11-28. This verison is used as default version
   */
  constructor(github_username: string, github_repository: string, githubToken?: string, apiVersion?: string) {
    this.errorHandler = new ErrorHandler();
    this.github_apiVersion = apiVersion ?? '2022-11-28';
    this.octokitClient = new Octokit({ auth: githubToken ?? process.env.GITHUB_TOKEN });
    this.githubWorkFlow = new GithubWorkflow(this.octokitClient, this.github_apiVersion, this.errorHandler);
    this.githubVariables = new GithubVariables(this.octokitClient, this.github_apiVersion, this.errorHandler);
    this.githubSecrets = new GithubSecrets(this.octokitClient, this.github_apiVersion, this.errorHandler);
    this.github_username = github_username;
    this.github_repository = github_repository;
  }
  UpdateOrganizationVariable(org: string, variableName: string, value: string): Promise<number> {
    return this.githubVariables.UpdateOrganizationVariable(org, variableName, value);
  }
  OrganizationVariableExists(org: string, variableName: string): Promise<boolean> {
    return this.githubVariables.OrganizationVariableExists(org, variableName);
  }
  GetOrganizationVariable(org: string, variableName: string): Promise<IActionsVariable> {
    return this.githubVariables.GetOrganizationVariable(org, variableName);
  }
  CreateOrganizationVariable(org: string, variableName: string, value: string): Promise<number> {
    return this.githubVariables.CreateOrganizationVariable(org, variableName, value);
  }
  ListOrganizationVariables(org: string): Promise<IActionsVariable[]> {
    return this.githubVariables.ListOrganizationVariables(org);
  }

  /**
   * Get all workflows of a specific repository and a specific owner
   * @returns
   */
  public async ListWorkflows(): Promise<Workflow[]> {
    return this.githubWorkFlow.ListWorkflows(this.github_username, this.github_repository);
  }
  /**
   * Gets all infos to a specific workflow
   * @param {string} workflowName  The name of the workflow to trigger
   * @returns The requested workflow, if not found undefined
   */
  public async GetWorkflow(workflow_id: number | string): Promise<Workflow | undefined> {
    return this.githubWorkFlow.GetWorkflow(this.github_username, this.github_repository, workflow_id);
  }

  /**
   * Triggers a workflow, identified by the given parameters
   * @param {string} workflowName  The name of the workflow to trigger
   * @param {string} branch  The name of the branch from which the code is to be taken
   */
  public async TriggerWorkflow(workflowName: string, branch: string): Promise<void> {
    await this.githubWorkFlow.TriggerWorkflow(this.github_username, this.github_repository, workflowName, branch);
  }

  /**
   * List all repository variables identified by owner and repository
   * @returns All variables of the repository
   */
  public async ListRepositoryVariables(): Promise<components['schemas']['actions-variable'][]> {
    return this.githubVariables.ListRepositoryVariables(this.github_username, this.github_repository);
  }

  /**
   * Creates a new repository variable
   * @param {string} variableName  The name of the variable to be created
   * @param {string} value  The value of the created variable
   * @returns 201, if created
   */
  public async CreateRepositoryVariable(variableName: string, value: string): Promise<number> {
    return this.githubVariables.CreateRepositoryVariable(this.github_username, this.github_repository, variableName, value);
  }

  /**
   * Returns a specific repository variable
   * @param {string} variableName  The name of the variable to be gathered
   * @returns The environment variable
   */
  public async GetRepositoryVariable(variableName: string): Promise<components['schemas']['actions-variable']> {
    return this.githubVariables.GetRepositoryVariable(this.github_username, this.github_repository, variableName);
  }

  /**
   * Checks if a specific repository variable exists
   * @param {string} variableName  The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  public async RepositoryVariableExists(variableName: string): Promise<boolean> {
    return this.githubVariables.RepositoryVariableExists(this.github_username, this.github_repository, variableName);
  }

  /**
   * Updates a specific repository variable
   * @param {string} variableName  The name of the variable to be gathered
   * @param {string} value  The value of the repository variable
   * @returns
   */
  public async UpdateRepositoryVariable(variableName: string, value: string): Promise<number> {
    return this.githubVariables.UpdateRepositoryVariable(this.github_username, this.github_repository, variableName, value);
  }

  /**
   * Creates or updates a specific repository variable
   * @param {string} variableName  The name of the variable to be gathered
   * @param {string} value  The value of the repository variable
   * @returns 201 if successfull created, otherwise 204 if updated
   */
  public async CreateOrUpdateRepositoryVariable(variableName: string, value: string): Promise<number> {
    return this.githubVariables.CreateOrUpdateRepositoryVariable(this.github_username, this.github_repository, variableName, value);
  }

  /**
   *  Delete a specific repository variable
   * @param {string} variableName  The name of the variable to be gathered
   * @returns 204 if deleted
   */
  public async DeleteRepositoryVariable(variableName: string): Promise<number> {
    return this.githubVariables.DeleteRepositoryVariable(this.github_username, this.github_repository, variableName);
  }

  /**
   * List all repository secrets
   * @returns A list of all secrets
   */
  public async ListRepositorySecrets(): Promise<components['schemas']['actions-secret'][]> {
    return this.githubSecrets.ListRepositorySecrets(this.github_username, this.github_repository);
  }

  /**
   *  Gets a repository secret, but no value!
   * @param {string} secretName  The name of the secret
   * @returns The secret itself without value
   */
  public async GetRepositorySecret(secretName: string): Promise<components['schemas']['actions-secret'] | undefined> {
    return this.githubSecrets.GetRepositorySecret(this.github_username, this.github_repository, secretName);
  }

  /**
   * Create or update a repository secret
   * @param {string} secretName  The name of the secret
   * @param {string} secretValue  The plain text value of the secret
   * @returns 204, if successful
   */
  public async CreateOrUpdateSecret(secretName: string, secretValue: string): Promise<number> {
    return this.githubSecrets.CreateOrUpdateSecret(this.github_username, this.github_repository, secretName, secretValue);
  }

  /**
   * Deletes a repository secret
   * @param {string} secretName  The name of the secret
   * @returns 204, if successful
   */
  public async DeleteRepositorySecret(secretName: string): Promise<number> {
    return this.githubSecrets.DeleteRepositorySecret(this.github_username, this.github_repository, secretName);
  }

  /**
   * Lists all workflow runs for a repository.
   */
  public async ListWorkflowRuns(): Promise<WorkflowRun[]> {
    return this.githubWorkFlow.ListWorkflowRuns(this.github_username, this.github_repository);
  }

  /**
   * Gets a specific workflow run
   * @param run_id  The unique identifier of the workflow run.
   * @returns
   */
  public async GetWorkflowRun(run_id: number): Promise<WorkflowRun> {
    return this.githubWorkFlow.GetWorkflowRun(this.github_username, this.github_repository, run_id);
  }

  /**
   * Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute.
   * @param {number} run_id  The unique identifier of the workflow run
   * @returns
   */
  public async DownloadWorkflowRunLogs(run_id: number): Promise<string | undefined> {
    return this.githubWorkFlow.DownloadWorkflowRunLogs(this.github_username, this.github_repository, run_id);
  }

  /**
   * Gets the number of billable minutes used by a specific workflow during the current billing cycle.
   * Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners.
   * Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage.
   * @param workflow_id The ID of the workflow
   * @returns
   */
  public async GetWorkflowUsage(workflow_id: number): Promise<components['schemas']['workflow-usage']> {
    return this.githubWorkFlow.GetWorkflowUsage(this.github_username, this.github_repository, workflow_id);
  }

  /**
   * Disables a workflow and sets the state of the workflow to disabled_manually. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.
   * @param workflow_id The ID of the workflow
   * @returns 204 indicates success
   */
  public async DisableWorkflow(workflow_id: number): Promise<number> {
    return this.githubWorkFlow.DisableWorkflow(this.github_username, this.github_repository, workflow_id);
  }

  /**
   * Enables a workflow and sets the state of the workflow to active. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.
   * @param workflow_id The ID of the workflow
   * @returns 204 indicates success
   */
  public async EnableWorkflow(workflow_id: number): Promise<number> {
    return this.githubWorkFlow.EnableWorkflow(this.github_username, this.github_repository, workflow_id);
  }
}
