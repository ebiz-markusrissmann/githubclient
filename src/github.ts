import { Octokit } from 'octokit';
import { components } from '@octokit/openapi-types/types';
import { GithubSecrets } from './github-secrets';
import { GithubVariables } from './github-variables';
import { GithubWorkflow } from './github-workflow';
import { IGithubClient } from './interfaces/i-github-client';
import { IGithubVariables } from './interfaces/i-github-variables';
import { IGithubWorkflow } from './interfaces/i-github-workflows';

export class GithubActionsClient implements IGithubClient {
  public octokitClient: Octokit;
  githubWorkFlow: IGithubWorkflow;
  githubVariables: IGithubVariables;
  githubSecrets: GithubSecrets;
  github_username: string;
  github_repository: string;
  github_apiVersion: string;

  /**
   * 
   * @param github_username - the github user that performs the actions
   * @param github_repository - the repository to perform a action
   * @param githubToken - the github token to be used, otherwise process.env.GITHUB_TOKEN is taken
   * @param apiVersion - the guithub api verion, e.g. 2022-11-28. This verison is used as default version   
   */
  constructor(github_username: string, github_repository: string, githubToken?: string, apiVersion?: string) {
    this.github_apiVersion = apiVersion ?? '2022-11-28';
    this.octokitClient = new Octokit({ auth: githubToken ?? process.env.GITHUB_TOKEN });
    this.githubWorkFlow = new GithubWorkflow(this.octokitClient, this.github_apiVersion);
    this.githubVariables = new GithubVariables(this.octokitClient, this.github_apiVersion);
    this.githubSecrets = new GithubSecrets(this.octokitClient, this.github_apiVersion);
    this.github_username = github_username;
    this.github_repository = github_repository;
  }

  /**
   * Get all workflows of a specific repository and a specific owner
   * @returns
   */
  public async ListWorkflows(): Promise<components['schemas']['workflow'][]> {
    return await this.githubWorkFlow.ListWorkflows(this.github_username, this.github_repository);
  }
  /**
   * Gets all infos to a specific workflow
   * @param {string} workflowName - The name of the workflow to trigger
   * @returns The requested workflow, if not found undefined
   */
  public async GetWorkflow(workflowName: string): Promise<components['schemas']['workflow'] | undefined> {
    return await this.githubWorkFlow.GetWorkflow(this.github_username, this.github_repository, workflowName);
  }

  /**
   * Triggers a workflow, identified by the given parameters
   * @param {string} workflowName - The name of the workflow to trigger
   * @param {string} branch - The name of the branch from which the code is to be taken
   */
  public async TriggerWorkflow(workflowName: string, branch: string): Promise<void> {
    await this.githubWorkFlow.TriggerWorkflow(this.github_username, this.github_repository, workflowName, branch);
  }

  /**
   * List all repository variables identified by owner and repository
   * @returns All variables of the repository
   */
  public async ListRepositoryVariables(): Promise<components['schemas']['actions-variable'][]> {
    return await this.githubVariables.ListRepositoryVariables(this.github_username, this.github_repository);
  }

  /**
   * Creates a new repository variable
   * @param {string} variableName - The name of the variable to be created
   * @param {string} value - The value of the created variable
   * @returns 201, if created
   */
  public async CreateRepositoryVariable(variableName: string, value: string): Promise<number> {
    return await this.githubVariables.CreateRepositoryVariable(this.github_username, this.github_repository, variableName, value);
  }

  /**
   * Returns a specific repository variable
   * @param {string} variableName - The name of the variable to be gathered
   * @returns The environment variable
   */
  public async GetRepositoryVariable(variableName: string): Promise<components['schemas']['actions-variable']> {
    return await this.githubVariables.GetRepositoryVariable(this.github_username, this.github_repository, variableName);
  }

  /**
   * Checks if a specific repository variable exists
   * @param {string} variableName - The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  public async RepositoryVariableExists(variableName: string): Promise<boolean> {
    return await this.githubVariables.RepositoryVariableExists(this.github_username, this.github_repository, variableName);
  }

  /**
   * Updates a specific repository variable
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns
   */
  public async UpdateRepositoryVariable(variableName: string, value: string): Promise<number> {
    return await this.githubVariables.UpdateRepositoryVariable(this.github_username, this.github_repository, variableName, value);
  }

  /**
   * Creates or updates a specific repository variable
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns 201 if successfull created, otherwise 204 if updated
   */
  public async CreateOrUpdateRepositoryVariable(variableName: string, value: string): Promise<number> {
    return await this.githubVariables.CreateOrUpdateRepositoryVariable(this.github_username, this.github_repository, variableName, value);
  }

  /**
   *  Delete a specific repository variable
   * @param {string} variableName - The name of the variable to be gathered
   * @returns 204 if deleted
   */
  public async DeleteRepositoryVariable(variableName: string): Promise<number> {
    return await this.githubVariables.DeleteRepositoryVariable(this.github_username, this.github_repository, variableName);
  }

  /**
   * List all repository secrets
   * @returns A list of all secrets
   */
  public async ListRepositorySecrets(): Promise<components['schemas']['actions-secret'][]> {
    return await this.githubSecrets.ListRepositorySecrets(this.github_username, this.github_repository);
  }

  /**
   *  Gets a repository secret, but no value!
   * @param {string} secretName - The name of the secret
   * @returns The secret itself without value
   */
  public async GetRepositorySecret(secretName: string): Promise<components['schemas']['actions-secret'] | undefined> {
    return await this.githubSecrets.GetRepositorySecret(this.github_username, this.github_repository, secretName);
  }

  /**
   * Create or update a repository secret
   * @param {string} secretName - The name of the secret
   * @param {string} secretValue - The plan text value of the secret
   * @returns 204, if successful
   */
  public async CreateOrUpdateSecret(secretName: string, secretValue: string): Promise<number> {
    return await this.githubSecrets.CreateOrUpdateSecret(this.github_username, this.github_repository, secretName, secretValue);
  }

  /**
   * Deletes a repository secret
   * @param {string} secretName - The name of the secret
   * @returns 204, if successful
   */
  public async DeleteRepositorySecret(secretName: string): Promise<number> {
    return await this.githubSecrets.DeleteRepositorySecret(this.github_username, this.github_repository, secretName);
  }

  /**
   *
   * @returns
   */
  public async ListWorkflowRuns(): Promise<components['schemas']['workflow-run'][]> {
    return await this.githubWorkFlow.ListWorkflowRuns(this.github_username, this.github_repository);
  }

  public async GetWorkflowRun(run_id: number): Promise<components['schemas']['workflow-run']> {
    return await this.githubWorkFlow.GetWorkflowRun(this.github_username, this.github_repository, run_id);
  }

  /**
   * Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute.
   * @param {number} run_id - The unique identifier of the workflow run
   * @returns 
   */
  public async DownloadWorkflowRunLogs(run_id: number): Promise<string | undefined> {
    return await this.githubWorkFlow.DownloadWorkflowRunLogs(this.github_username, this.github_repository, run_id);
  }
}
