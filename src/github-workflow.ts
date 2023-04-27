import { Octokit } from 'octokit';
import { ErrorHandler } from './tools-utils/error-handler';
import { Workflow } from './data/workflow';
import { WorkflowRun } from './data/workflow-run';
import { IGithubWorkflow } from './interfaces/i-github-workflows';
import { IWorkflowUsage } from './interfaces/responses/i-workflow-usage';

export class GithubWorkflow implements IGithubWorkflow {
  private octokit: Octokit;
  private apiVersion: string;
  private errorHandler: ErrorHandler;

  constructor(octokit: Octokit, apiVersion: string, errorHandler: ErrorHandler) {
    this.octokit = octokit;
    this.apiVersion = apiVersion;

    this.errorHandler = errorHandler;
  }

  /**
   * Get all workflows of a specific repository and a specific owner
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @returns {workflow[]}
   */
  public async ListWorkflows(owner: string, repo: string): Promise<Workflow[]> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
        owner: owner,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });

      return response.data.workflows;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }
  /**
   * Gets all infos to a specific workflow
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param {number} workflow_id - The ID of the workflow. You can also pass the workflow file name as a string.
   * @returns The requested workflow, if not found undefined
   */
  public async GetWorkflow(owner: string, repo: string, workflow_id: number | string): Promise<Workflow | undefined> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}', {
        owner,
        repo,
        workflow_id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      return response.data;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   *
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @param {string} branch - The name of the branch from which the code is to be taken
   * @param {string} inputs - Input keys and values configured in the workflow file. The maximum number of properties is 10. Any default properties configured in the workflow file will be used when inputs are omitted.
   */
  public async TriggerWorkflow(owner: string, repo: string, workflowName: string, branch: string, inputs?: any): Promise<number | undefined> {
    try {
      const workflows = await this.ListWorkflows(owner, repo);
      const wf = workflows.find((a) => a.name === workflowName);

      if (wf) {
        const response = await this.octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
          owner: owner,
          repo: repo,
          workflow_id: wf!.id,
          ref: branch,
          inputs: inputs,
          headers: {
            'X-GitHub-Api-Version': this.apiVersion,
          },
        });

        return response.status;
      }
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
    /* istanbul ignore next */
    return 404;
  }

  /**
   * Lists all workflow runs for a repository
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @returns
   */
  public async ListWorkflowRuns(owner: string, repo: string): Promise<WorkflowRun[]> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
        owner: owner,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });

      return response.data.workflow_runs;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   * Gets a specific workflow run
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param {number} run_id - The unique identifier of the workflow run
   * @returns
   */
  public async GetWorkflowRun(owner: string, repo: string, run_id: number): Promise<WorkflowRun> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
        owner: owner,
        repo: repo,
        run_id: run_id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return response.data;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   * Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute.
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param {number} run_id - The unique identifier of the workflow run
   * @returns
   */
  public async DownloadWorkflowRunLogs(owner: string, repo: string, run_id: number): Promise<string | undefined> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs', {
        owner: owner,
        repo: repo,
        run_id: run_id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      return response.headers.location;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }

    /* istanbul ignore next */
    return undefined;
  }

  /**
   * Gets the number of billable minutes used by a specific workflow during the current billing cycle. Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners. Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage.
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param workflow_id - The ID of the workflow
   * @returns
   */
  public async GetWorkflowUsage(owner: string, repo: string, workflow_id: number): Promise<IWorkflowUsage> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing', {
        owner,
        repo,
        workflow_id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      return response.data;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   * Disables a workflow and sets the state of the workflow to disabled_manually. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param workflow_id - The ID of the workflow
   * @returns
   */
  public async DisableWorkflow(owner: string, repo: string, workflow_id: number): Promise<number> {
    try {
      const response = await this.octokit.request('PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable', {
        owner,
        repo,
        workflow_id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return response.status;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   * Enables a workflow and sets the state of the workflow to active. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.
   * @param {string} owner - The account owner of the repository
   * @param {string} repo - The name of the repository
   * @param workflow_id - The ID of the workflow
   * @returns
   */
  public async EnableWorkflow(owner: string, repo: string, workflow_id: number): Promise<number> {
    try {
      const response = await this.octokit.request('PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable', {
        owner,
        repo,
        workflow_id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return response.status;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }
}
