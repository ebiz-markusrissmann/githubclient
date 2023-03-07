import { Octokit } from 'octokit';
import { components } from '@octokit/openapi-types/types';

export class GithubWorkflow {
  private octokit: Octokit;
  private apiVersion: string;

  constructor(octokit: Octokit, apiVersion: string) {
    this.octokit = octokit;
    this.apiVersion = apiVersion;
  }

  /**
   * Get all workflows of a specific repository and a specific owner
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns {workflow[]}
   */
  public async ListWorkflows(owner: string, repo: string): Promise<components['schemas']['workflow'][]> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': this.apiVersion,
      },
    });

    return response.data.workflows;
  }
  /**
   * Gets all infos to a specific workflow
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @returns The requested workflow, if not found undefined
   */
  public async GetWorkflow(owner: string, repo: string, workflowName: string): Promise<components['schemas']['workflow'] | undefined> {
    const workflows = await this.ListWorkflows(owner, repo);
    const wf = workflows.find((a) => a.name === workflowName);
    return wf;
  }

  /**
   *
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @param {string} branch - The name of the branch from which the code is to be taken
   * @param {string} inputs - Input keys and values configured in the workflow file. The maximum number of properties is 10. Any default properties configured in the workflow file will be used when inputs are omitted.
   */
  public async TriggerWorkflow(owner: string, repo: string, workflowName: string, branch: string, inputs?: any): Promise<void> {
    const workflows = await this.ListWorkflows(owner, repo);
    const wf = workflows.find((a) => a.name === workflowName);

    if (wf) {
      await this.octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: owner,
        repo: repo,
        workflow_id: wf!.id,
        ref: branch,
        inputs: inputs,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });
    }
  }

  /**
   * Lists all workflow runs for a repository
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns
   */
  public async ListWorkflowRuns(owner: string, repo: string): Promise<components['schemas']['workflow-run'][]> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': this.apiVersion,
      },
    });

    return response.data.workflow_runs;
  }

  /**
   * Gets a specific workflow run
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {number} run_id - The unique identifier of the workflow run
   * @returns
   */
  public async GetWorkflowRun(owner: string, repo: string, run_id: number): Promise<components['schemas']['workflow-run']> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
      owner: owner,
      repo: repo,
      run_id: run_id,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return response.data;
  }
}
