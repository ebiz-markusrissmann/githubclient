import { Octokit } from 'octokit';
import { GithubWorkflow } from './github-workflow';

export class GithubClient {
  public octokitClient: Octokit;

  constructor(octokitClient?: Octokit, token?: string) {
    this.octokitClient = octokitClient ?? new Octokit({ auth: token ?? process.env.GITHUB_TOKEN });
  }

  /**
   * Get all workflows of a specific repository and a specific owner
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns
   */
  public async ListWorkflows(owner: string, repo: string) {
    const githubWorkflow = new GithubWorkflow(this.octokitClient);
    return githubWorkflow.ListWorkflows(owner, repo);
  }
  /**
   * Gets all infos to a specific workflow
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @returns The requested workflow, if not found undefined
   */
  public async GetWorkflow(owner: string, repo: string, workflowName: string) {
    const githubWorkflow = new GithubWorkflow(this.octokitClient);
    return githubWorkflow.GetWorkflow(owner, repo, workflowName);
  }

  /**
   *
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @param {string} branch - The name of the branch from which the code is to be taken
   */
  public async TriggerWorkflow(owner: string, repo: string, workflowName: string, branch: string): Promise<void> {
    const githubWorkflow = new GithubWorkflow(this.octokitClient);
    await githubWorkflow.TriggerWorkflow(owner, repo, workflowName, branch);
  }
}
