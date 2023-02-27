import { Octokit } from 'octokit';
import { GithubSecrets } from './github-secrets';
import { GithubVariables } from './github-variables';
import { GithubWorkflow } from './github-workflow';
import { IGithubClient } from './interfaces/i-github-client';
import { IGithubVariables } from './interfaces/i-github-variables';
import { IGithubWorkflow } from './interfaces/i-github-workflows';
import { githubSecret } from './models/secret';
import { githubvariable } from './models/variables';
import { workflow } from './models/workflow';

export class GithubClient implements IGithubClient {
  public octokitClient: Octokit;
  githubWorkFlow: IGithubWorkflow;
  githubVariables: IGithubVariables;
  githubSecrets: GithubSecrets;

  constructor(octokitClient?: Octokit, githubWorkFlow?: IGithubWorkflow, token?: string) {
    this.octokitClient = octokitClient ?? new Octokit({ auth: token ?? process.env.GITHUB_TOKEN });
    this.githubWorkFlow = githubWorkFlow ?? new GithubWorkflow(this.octokitClient);
    this.githubVariables = new GithubVariables(this.octokitClient);
    this.githubSecrets = new GithubSecrets(this.octokitClient);
  }

  /**
   * Get all workflows of a specific repository and a specific owner
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns
   */
  public async ListWorkflows(owner: string, repo: string): Promise<workflow[]> {
    return await this.githubWorkFlow.ListWorkflows(owner, repo);
  }
  /**
   * Gets all infos to a specific workflow
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @returns The requested workflow, if not found undefined
   */
  public async GetWorkflow(owner: string, repo: string, workflowName: string): Promise<workflow | undefined> {
    return await this.githubWorkFlow.GetWorkflow(owner, repo, workflowName);
  }

  /**
   * Triggers a workflow, identified by the given parameters
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @param {string} branch - The name of the branch from which the code is to be taken
   */
  public async TriggerWorkflow(owner: string, repo: string, workflowName: string, branch: string): Promise<void> {
    await this.githubWorkFlow.TriggerWorkflow(owner, repo, workflowName, branch);
  }

  /**
   * List all repository variables identified by owner and repository
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns All variables of the repository
   */
  public async ListRepositoryVariables(owner: string, repo: string): Promise<githubvariable[]> {
    return await this.githubVariables.ListRepositoryVariables(owner, repo);
  }

  /**
   * Creates a new repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be created
   * @param {string} value - The value of the created variable
   * @returns 201, if created
   */
  public async CreateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number> {
    return await this.githubVariables.CreateRepositoryVariable(owner, repo, variableName, value);
  }

  /**
   * Returns a specific repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns The environment variable
   */
  public async GetRepositoryVariable(owner: string, repo: string, variableName: string): Promise<githubvariable> {
    return await this.githubVariables.GetRepositoryVariable(owner, repo, variableName);
  }

  /**
   * Checks if a specific repository variable exists
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  public async RepositoryVariableExists(owner: string, repo: string, variableName: string): Promise<boolean> {
    return await this.githubVariables.RepositoryVariableExists(owner, repo, variableName);
  }

  /**
   * Updates a specific repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns
   */
  public async UpdateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number> {
    return await this.githubVariables.UpdateRepositoryVariable(owner, repo, variableName, value);
  }

  /**
   *  Delete a specific repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns 204 if deleted
   */
  public async DeleteRepositoryVariable(owner: string, repo: string, variableName: string): Promise<number> {
    return await this.githubVariables.DeleteRepositoryVariable(owner, repo, variableName);
  }

  /**
   * List all repository secrets
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns A list of all secrets
   */
  public async ListRepositorySecrets(owner: string, repo: string): Promise<githubSecret[]> {
    return await this.githubSecrets.ListRepositorySecrets(owner, repo);
  }

  /**
   *  Gets a repository secret, but no value!
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @returns The secret itself without value
   */
  public async GetRepositorySecret(owner: string, repo: string, secretName: string): Promise<githubSecret | undefined> {
    return await this.githubSecrets.GetRepositorySecret(owner, repo, secretName);
  }

  /**
   * Create or update a repository secret
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @param {string} secretValue - The plan text value of the secret
   * @returns 204, if successful
   */
  public async CreateOrUpdateSecret(owner: string, repo: string, secretName: string, secretValue: string): Promise<number> {
    return await this.githubSecrets.CreateOrUpdateSecret(owner, repo, secretName, secretValue);
  }

  /**
   * Deletes a repository secret
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @returns 204, if successful
   */
  public async DeleteRepositorySecret(owner: string, repo: string, secretName: string): Promise<number> {
    return await this.githubSecrets.DeleteRepositorySecret(owner, repo, secretName);
  }
}
