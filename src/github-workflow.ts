import { Octokit } from 'octokit';
import { workflow } from './models/workflow';

export class GithubWorkflow {
  private octokit: Octokit;

  constructor(octokit: Octokit) {
    this.octokit = octokit;
  }

  public async ListWorkflows(owner: string, repo: string): Promise<workflow[]> {
    const retVal: workflow[] = [];
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    response.data.workflows.forEach((wf) => {
      retVal.push(wf);
    });

    return retVal;
  }

  public async GetWorkflow(owner: string, repo: string, workflowName: string): Promise<workflow | undefined> {
    const workflows = await this.ListWorkflows(owner, repo);
    const wf = workflows.find((a) => a.name === workflowName);
    return wf;
  }

  public async TriggerWorkflow(owner: string, repo: string, workflowName: string, branch: string) {
    const workflows = await this.ListWorkflows(owner, repo);
    const wf = workflows.find((a) => a.name === workflowName);

    if (wf) {
      await this.octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: owner,
        repo: repo,
        workflow_id: wf!.id,
        ref: branch,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
    }
  }
}
